"""
Export the AI Trading Model so the browser can run it.

This reproduces the pipeline in github.com/JakeRecharte/Trading-Model exactly:
same 50-ticker universe, same five rolling-window features, same 21-day
horizon, same time-ordered 80/20 split, same `RandomForestRegressor(200, 8,
random_state=42)`. It then writes two files the demo in
`src/components/demos/TradingDemo.tsx` fetches at runtime:

    public/demos/trading-forest.json   the trained forest, as flat arrays
    public/demos/trading-prices.json   prices over the test window + lead-in

Nothing from the model runs on a server. The forest is ~200 small trees, so
walking it in TypeScript is a few milliseconds and the demo needs no Python
host, no API key and no cold start.

Run it from the repo root with a venv that has scikit-learn, pandas and
yfinance:

    python scripts/export-trading-demo.py

It hits the Yahoo Finance API, so it needs network and takes a couple of
minutes. The outputs are committed; a visitor never triggers this.
"""

import json
import os

import numpy as np
import pandas as pd
import yfinance as yf
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, r2_score

# --- the repo's constants, copied so this script stands alone ----------------

UNIVERSE = [
    "AAPL", "MSFT", "GOOGL", "AMZN", "META",
    "NVDA", "TSLA", "NFLX", "PEP", "KO",
    "JPM", "BAC", "WFC", "UNH", "XOM",
    "CVX", "DIS", "NKE", "HD", "COST",
    "QCOM", "TXN", "INTC", "AMD", "IBM",
    "ORCL", "CRM", "ADBE", "PYPL", "MA",
    "V", "WMT", "TGT", "GE", "CAT",
    "UPS", "FDX", "ABBV", "LLY", "JNJ",
    "PFE", "GS", "C", "MCD", "LOW",
    "BA", "SLB", "COP", "CVS", "EXC",
]

START, END = "2015-01-01", "2025-01-01"
HORIZON = 21
SHORT, MID, LONG = 5, 21, 63
MIN_HISTORY_DAYS = 225
TOP_K = 5
# The browser needs `LONG` prior closes to build the 63-day feature, plus one
# more row for the first pct_change. A little slack keeps the first slider
# position from sitting exactly on the boundary.
LEAD_IN = LONG + 10

OUT_DIR = "public/demos"
CACHE = os.path.join("scripts", ".cache-prices.csv")


def load_prices() -> pd.DataFrame:
    """`data_loader.load_data` + `clean_price_data`, with a local cache."""
    if os.path.exists(CACHE):
        print(f"Using cached prices at {CACHE}")
        prices = pd.read_csv(CACHE, index_col=0, parse_dates=True)
    else:
        print("Downloading from Yahoo Finance...")
        raw = yf.download(
            UNIVERSE, start=START, end=END, auto_adjust=False, progress=False
        )
        prices = raw["Adj Close"].dropna(axis=1, how="all").ffill().bfill()
        os.makedirs(os.path.dirname(CACHE), exist_ok=True)
        prices.to_csv(CACHE)
        print(f"Cached to {CACHE}")

    keep = prices.columns[prices.notna().sum() > MIN_HISTORY_DAYS]
    prices = prices[keep]
    print(f"  prices: {prices.shape[0]} dates x {prices.shape[1]} tickers")
    return prices


def make_features(prices: pd.DataFrame) -> pd.DataFrame:
    """`features.make_features`, verbatim in behaviour."""
    out = {}
    for ticker in prices.columns:
        p = prices[ticker]
        r = p.pct_change()
        out[(ticker, "ret_5d")] = p.pct_change(SHORT)
        out[(ticker, "ret_21d")] = p.pct_change(MID)
        out[(ticker, "ret_63d")] = p.pct_change(LONG)
        out[(ticker, "vol21d")] = r.rolling(MID).std()
        out[(ticker, "ma_ratio_63d")] = p / p.rolling(LONG).mean()
    return pd.DataFrame.from_dict(out).dropna()


def build_dataset(prices: pd.DataFrame):
    """`model.build_dataset`, verbatim in behaviour."""
    features = make_features(prices)
    future = prices.pct_change(HORIZON).shift(-HORIZON).loc[features.index]

    x_long = features.stack(level=0, future_stack=True)
    y_long = future.stack()

    common = x_long.index.intersection(y_long.index)
    x_long, y_long = x_long.loc[common], y_long.loc[common]

    mask = ~y_long.isna()
    x_long, y_long = x_long[mask], y_long[mask]

    return x_long, y_long


def export_forest(model: RandomForestRegressor, feature_names: list[str]) -> dict:
    """
    The forest as flat arrays, one entry per node, in sklearn's own layout:
    `feature[i]` and `threshold[i]` decide whether to walk to `left[i]` or
    `right[i]`, and a leaf (feature -2) carries its mean in `value[i]`.

    Thresholds keep 6 significant digits and leaf values 8 decimals, both
    well inside the noise of a 21-day return prediction, and together they cut
    the payload roughly in half against full float repr.
    """
    trees = []
    nodes = 0
    for est in model.estimators_:
        t = est.tree_
        is_leaf = t.children_left == -1

        # sklearn builds depth-first, so an internal node's left child is
        # always the next node in the array. Asserting it lets the payload
        # drop the whole `children_left` array and walk `i + 1` instead.
        for i, leaf in enumerate(is_leaf):
            if not leaf and t.children_left[i] != i + 1:
                raise AssertionError(
                    f"tree is not depth-first at node {i}; keep children_left"
                )

        nodes += len(is_leaf)
        trees.append(
            {
                "f": t.feature.astype(int).tolist(),
                # 5 significant digits on a threshold and a leaf mean is far
                # inside the noise of a 21-day return, and roughly halves the
                # payload against full float repr.
                "t": [
                    0 if leaf else float(f"{v:.5g}")
                    for v, leaf in zip(t.threshold, is_leaf)
                ],
                "r": t.children_right.astype(int).tolist(),
                "v": [float(f"{v:.5g}") for v in t.value.ravel()],
            }
        )
    print(f"  forest: {len(trees)} trees, {nodes} nodes")

    return {
        "features": feature_names,
        "horizon": HORIZON,
        "topK": TOP_K,
        "windows": {"short": SHORT, "mid": MID, "long": LONG},
        "trees": trees,
    }


def main() -> None:
    prices = load_prices()
    x_long, y_long = build_dataset(prices)

    feature_names = list(x_long.columns)
    x = x_long.values.astype(np.float32)
    y = y_long.values.astype(np.float32)
    print(f"  dataset: {x.shape[0]} samples x {x.shape[1]} features")
    print(f"  feature order: {feature_names}")

    split = int(x.shape[0] * 0.8)
    model = RandomForestRegressor(
        n_estimators=200, max_depth=8, n_jobs=-1, random_state=42
    )
    print("Training...")
    model.fit(x[:split], y[:split])

    pred = model.predict(x[split:])
    print(f"  test R^2: {r2_score(y[split:], pred):.4f}")
    print(f"  test MSE: {mean_squared_error(y[split:], pred):.8f}")

    # The backtest the README's 1.7% comes from, recomputed here so the demo
    # and the claim are the same number.
    frame = pd.DataFrame(
        {"y_true": y[split:], "y_pred": pred}, index=x_long.index[split:]
    )
    frame.index.names = ["date", "ticker"]
    frame = frame.reset_index()
    per_date = frame.groupby("date").apply(
        lambda g: pd.Series(
            {
                "strategy": g.nlargest(TOP_K, "y_pred")["y_true"].mean(),
                "universe": g["y_true"].mean(),
            }
        ),
        include_groups=False,
    )
    edge = (per_date["strategy"] - per_date["universe"]).mean()
    print(f"  strategy mean: {per_date['strategy'].mean():.4%}")
    print(f"  universe mean: {per_date['universe'].mean():.4%}")
    print(f"  edge per horizon: {edge:.4%}")

    # --- the two payloads --------------------------------------------------

    test_dates = frame["date"].unique()
    first_test_date = pd.Timestamp(test_dates.min())
    window_start = prices.index.get_loc(
        prices.index[prices.index <= first_test_date][-1]
    ) - LEAD_IN
    window = prices.iloc[max(window_start, 0):]

    os.makedirs(OUT_DIR, exist_ok=True)

    forest_path = os.path.join(OUT_DIR, "trading-forest.json")
    with open(forest_path, "w") as f:
        json.dump(export_forest(model, feature_names), f, separators=(",", ":"))

    tickers = list(window.columns)
    prices_payload = {
        "dates": [d.strftime("%Y-%m-%d") for d in window.index],
        "tickers": tickers,
        # Column-major: one array per ticker, aligned to `dates`.
        "closes": [
            [round(float(v), 4) for v in window[t].to_numpy()] for t in tickers
        ],
        "firstTestDate": first_test_date.strftime("%Y-%m-%d"),
        "leadIn": LEAD_IN,
        "backtest": {
            "strategy": round(float(per_date["strategy"].mean()), 6),
            "universe": round(float(per_date["universe"].mean()), 6),
            "edge": round(float(edge), 6),
            "horizons": int(per_date.shape[0]),
        },
    }
    prices_path = os.path.join(OUT_DIR, "trading-prices.json")
    with open(prices_path, "w") as f:
        json.dump(prices_payload, f, separators=(",", ":"))

    for p in (forest_path, prices_path):
        print(f"  wrote {p}  {os.path.getsize(p) / 1024:.0f} KB")


if __name__ == "__main__":
    main()
