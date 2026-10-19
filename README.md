# MoFlex

The public MoFlex site. Viewers watch **Tales Of The Legend** and **A Fix In Time** here.

- `index.html` — home, Shows and Trailers tabs
- `watch.html` — the player (`watch.html?show=a-fix-in-time&type=episode&n=1`; links without `show` play Tales Of The Legend)
- `catalog.js` — every show, its episodes and card pictures
- `episodes/`, `trailers/` — Tales Of The Legend: 8 episodes and 8 trailers
- `a-fix-in-time/episodes/`, `a-fix-in-time/trailers/` — A Fix In Time: 7 episodes and 7 trailers
- `a-fix-in-time/src/` — the story files and shared engine for A Fix In Time. After editing, run `python3 a-fix-in-time/src/build.py` to rebuild the episode and trailer pages.
- `availability.json` — which episodes and trailers are released (changed from the MoFlex Admin site).
  The top-level `episodes`/`trailers` are Tales Of The Legend; other shows are under `shows`.
