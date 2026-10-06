importScripts("https://cdn.jsdelivr.net/pyodide/v0.29.3/full/pyodide.js");

function sendPatch(patch, buffers, msg_id) {
  self.postMessage({
    type: 'patch',
    patch: patch,
    buffers: buffers
  })
}

async function startApplication() {
  console.log("Loading pyodide...");
  self.postMessage({type: 'status', msg: 'Loading pyodide'})
  self.pyodide = await loadPyodide();
  self.pyodide.globals.set("sendPatch", sendPatch);
  console.log("Loaded pyodide!");
  const data_archives = [];
  for (const archive of data_archives) {
    let zipResponse = await fetch(archive);
    let zipBinary = await zipResponse.arrayBuffer();
    self.postMessage({type: 'status', msg: `Unpacking ${archive}`})
    self.pyodide.unpackArchive(zipBinary, "zip");
  }
  await self.pyodide.loadPackage("micropip");
  self.postMessage({type: 'status', msg: `Installing environment`})
  try {
    await self.pyodide.runPythonAsync(`
      import micropip
      await micropip.install(['https://cdn.holoviz.org/panel/wheels/bokeh-3.9.2-py3-none-any.whl', 'https://cdn.holoviz.org/panel/1.9.4/dist/wheels/panel-1.9.4-py3-none-any.whl', 'pyodide-http', 'pandas', 'matplotlib', 'seaborn']);
    `);
  } catch(e) {
    console.log(e)
    self.postMessage({
      type: 'status',
      msg: `Error while installing packages`
    });
  }
  console.log("Environment loaded!");
  self.postMessage({type: 'status', msg: 'Executing code'})
  try {
    const [docs_json, render_items, root_ids] = await self.pyodide.runPythonAsync(`\nimport asyncio\n\nfrom panel.io.pyodide import init_doc, write_doc\n\ninit_doc()\n\nfrom panel import state as _pn__state\nfrom panel.io.handlers import CELL_DISPLAY as _CELL__DISPLAY, display, get_figure as _get__figure\n\n_pn__state._cell_outputs['7011ae9a'].append("""# \u041b\u0430\u0431\u043e\u0440\u0430\u0442\u043e\u0440\u043d\u0430\u044f \u0440\u0430\u0431\u043e\u0442\u0430 \u21163. \u0417\u0430\u0434\u0430\u043d\u0438\u0435 5\n## \u041f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 Panel App: \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c \xab\u0427\u0430\u0435\u0432\u044b\u0435 \u0432 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0435\xbb\n\n\u041d\u043e\u0443\u0442\u0431\u0443\u043a \u043e\u0444\u043e\u0440\u043c\u043b\u0435\u043d \u043a\u0430\u043a \u043f\u0440\u0438\u043b\u043e\u0436\u0435\u043d\u0438\u0435 **Panel**: \u044f\u0447\u0435\u0439\u043a\u0438 \u0441 \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442\u0430\u043c\u0438, \u043f\u043e\u043c\u0435\u0447\u0435\u043d\u043d\u044b\u0435 \`.servable()\`, \u0441\u043e\u0441\u0442\u0430\u0432\u043b\u044f\u044e\u0442 \u043f\u0430\u043d\u0435\u043b\u044c, \u043a\u043e\u0442\u043e\u0440\u0430\u044f \u0437\u0430\u043f\u0443\u0441\u043a\u0430\u0435\u0442\u0441\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043e\u0439\n\n\`\`\`bash\npanel serve panel_app.ipynb --show\n\`\`\`\n\n\u0414\u043b\u044f \u0434\u0430\u043d\u043d\u044b\u0445 \u0438\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u0442\u0441\u044f \u043d\u0430\u0431\u043e\u0440 \`tips\` \u0438\u0437 seaborn (\u0447\u0435\u043a, \u0447\u0430\u0435\u0432\u044b\u0435, \u043f\u043e\u043b, \u043a\u0443\u0440\u0435\u043d\u0438\u0435, \u0434\u0435\u043d\u044c \u043d\u0435\u0434\u0435\u043b\u0438, \u0432\u0440\u0435\u043c\u044f \u0441\u0443\u0442\u043e\u043a, \u0440\u0430\u0437\u043c\u0435\u0440 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438).""")\n_pn__state._cell_outputs['901fa3e8'].append("""## \u0418\u0441\u043f\u043e\u043b\u044c\u0437\u0443\u0435\u043c\u044b\u0435 \u0443\u0442\u0438\u043b\u0438\u0442\u044b, \u0431\u0438\u0431\u043b\u0438\u043e\u0442\u0435\u043a\u0438 \u0438 \u0437\u0430\u0432\u0438\u0441\u0438\u043c\u043e\u0441\u0442\u0438""")\nimport sys, panel, bokeh, pandas, seaborn, matplotlib, numpy\nprint('Python', sys.version.split()[0])\nfor m in (panel, bokeh, pandas, seaborn, matplotlib, numpy): print(m.__name__, m.__version__)\n_pn__state._cell_outputs['9e31e9b0'].append("""## 1. \u0414\u0430\u043d\u043d\u044b\u0435""")\nimport numpy as np, pandas as pd, seaborn as sns\nimport matplotlib\nmatplotlib.use('agg')\nfrom matplotlib.figure import Figure\nimport panel as pn\npn.extension('tabulator', sizing_mode='stretch_width')\n\ntips = pd.read_csv('https://raw.githubusercontent.com/mwaskom/seaborn-data/master/tips.csv')\ntips['tip_pct'] = (tips['tip'] / tips['total_bill'] * 100).round(2)   # \u0447\u0430\u0435\u0432\u044b\u0435 \u0432 % \u043e\u0442 \u0447\u0435\u043a\u0430\n_pn__state._cell_outputs['7aa39050'].append((tips.head()))\nfor _cell__out in _CELL__DISPLAY:\n    _pn__state._cell_outputs['7aa39050'].append(_cell__out)\n_CELL__DISPLAY.clear()\n_fig__out = _get__figure()\nif _fig__out:\n    _pn__state._cell_outputs['7aa39050'].append(_fig__out)\n\n_pn__state._cell_outputs['de9cad2b'].append("""## 2. \u0412\u0438\u0434\u0436\u0435\u0442\u044b\n\u0424\u0438\u043b\u044c\u0442\u0440\u044b \u043f\u043e \u0434\u043d\u044e \u043d\u0435\u0434\u0435\u043b\u0438, \u0432\u0440\u0435\u043c\u0435\u043d\u0438 \u0441\u0443\u0442\u043e\u043a, \u043a\u0443\u0440\u0438\u043b\u044c\u0449\u0438\u043a\u0430\u043c, \u0440\u0430\u0437\u043c\u0435\u0440\u0443 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438 \u0438 \u0434\u0438\u0430\u043f\u0430\u0437\u043e\u043d\u0443 \u0441\u0443\u043c\u043c\u044b \u0447\u0435\u043a\u0430, \u0430 \u0442\u0430\u043a\u0436\u0435 \u0432\u044b\u0431\u043e\u0440 \u043f\u0440\u0438\u0437\u043d\u0430\u043a\u043e\u0432 \u0434\u043b\u044f \u0434\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u044b \u0440\u0430\u0441\u0441\u0435\u044f\u043d\u0438\u044f.""")\ndays    = pn.widgets.CheckButtonGroup(name='\u0414\u0435\u043d\u044c \u043d\u0435\u0434\u0435\u043b\u0438', options=['Thur','Fri','Sat','Sun'], value=['Thur','Fri','Sat','Sun'], button_type='primary')\ntimes   = pn.widgets.CheckBoxGroup(name='\u0412\u0440\u0435\u043c\u044f \u0441\u0443\u0442\u043e\u043a', options=['Lunch','Dinner'], value=['Lunch','Dinner'], inline=True)\nsmoker  = pn.widgets.RadioButtonGroup(name='\u041a\u0443\u0440\u0438\u043b\u044c\u0449\u0438\u043a\u0438', options=['\u0412\u0441\u0435','Yes','No'], value='\u0412\u0441\u0435')\nsize    = pn.widgets.IntRangeSlider(name='\u0420\u0430\u0437\u043c\u0435\u0440 \u043a\u043e\u043c\u043f\u0430\u043d\u0438\u0438', start=1, end=6, value=(1,6), step=1)\nbill    = pn.widgets.RangeSlider(name='\u0421\u0443\u043c\u043c\u0430 \u0447\u0435\u043a\u0430, $', start=float(tips.total_bill.min()), end=float(tips.total_bill.max()),\n                                 value=(float(tips.total_bill.min()), float(tips.total_bill.max())), step=1)\ncolor_by = pn.widgets.Select(name='\u0426\u0432\u0435\u0442 \u0442\u043e\u0447\u0435\u043a', options=['day','time','sex','smoker'], value='day')\ny_axis   = pn.widgets.Select(name='\u041e\u0441\u044c Y', options=['tip','tip_pct'], value='tip')\n_pn__state._cell_outputs['16b937df'].append("""## 3. \u041b\u043e\u0433\u0438\u043a\u0430: \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u0446\u0438\u044f \u0438 \u043f\u043e\u0441\u0442\u0440\u043e\u0435\u043d\u0438\u0435 \u0433\u0440\u0430\u0444\u0438\u043a\u043e\u0432\n\u0424\u0443\u043d\u043a\u0446\u0438\u0438 \u0441\u0432\u044f\u0437\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0441 \u0432\u0438\u0434\u0436\u0435\u0442\u0430\u043c\u0438 \u0447\u0435\u0440\u0435\u0437 \`pn.bind\` \u2014 \u043f\u0440\u0438 \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u0438 \u043b\u044e\u0431\u043e\u0433\u043e \u0432\u0438\u0434\u0436\u0435\u0442\u0430 \u043f\u0435\u0440\u0435\u0441\u0447\u0438\u0442\u044b\u0432\u0430\u044e\u0442\u0441\u044f \u0442\u043e\u043b\u044c\u043a\u043e \u0437\u0430\u0432\u0438\u0441\u044f\u0449\u0438\u0435 \u043e\u0442 \u043d\u0435\u0433\u043e \u043a\u043e\u043c\u043f\u043e\u043d\u0435\u043d\u0442\u044b.""")\ndef filtered(days, times, smoker, size, bill):\n    df = tips[tips.day.isin(days) & tips.time.isin(times)]\n    if smoker != '\u0412\u0441\u0435':\n        df = df[df.smoker == smoker]\n    df = df[df['size'].between(*size) & df.total_bill.between(*bill)]\n    return df\n\ndef scatter(days, times, smoker, size, bill, color_by, y_axis):\n    df = filtered(days, times, smoker, size, bill)\n    fig = Figure(figsize=(7, 4.5)); ax = fig.subplots()\n    for key, g in df.groupby(color_by, observed=True):\n        ax.scatter(g.total_bill, g[y_axis], label=str(key), alpha=.8, s=35)\n    ax.set_xlabel('\u0421\u0443\u043c\u043c\u0430 \u0447\u0435\u043a\u0430, $'); ax.set_ylabel('\u0427\u0430\u0435\u0432\u044b\u0435, $' if y_axis=='tip' else '\u0427\u0430\u0435\u0432\u044b\u0435, % \u043e\u0442 \u0447\u0435\u043a\u0430')\n    ax.set_title(f'\u0427\u0430\u0435\u0432\u044b\u0435 \u0438 \u0441\u0443\u043c\u043c\u0430 \u0447\u0435\u043a\u0430 (\u0441\u0442\u0440\u043e\u043a: {len(df)})'); ax.grid(alpha=.3)\n    if len(df): ax.legend(title=color_by)\n    return pn.pane.Matplotlib(fig, tight=True, dpi=110)\n\ndef by_day(days, times, smoker, size, bill):\n    df = filtered(days, times, smoker, size, bill)\n    fig = Figure(figsize=(7, 4.5)); ax = fig.subplots()\n    order = [d for d in ['Thur','Fri','Sat','Sun'] if d in set(df.day)]\n    m = df.groupby('day', observed=True)['tip'].mean().reindex(order)\n    ax.bar(m.index.astype(str), m.values, color='#4c78a8')\n    ax.set_xlabel('\u0414\u0435\u043d\u044c \u043d\u0435\u0434\u0435\u043b\u0438'); ax.set_ylabel('\u0421\u0440\u0435\u0434\u043d\u0438\u0435 \u0447\u0430\u0435\u0432\u044b\u0435, $'); ax.set_title('\u0421\u0440\u0435\u0434\u043d\u0438\u0435 \u0447\u0430\u0435\u0432\u044b\u0435 \u043f\u043e \u0434\u043d\u044f\u043c'); ax.grid(axis='y', alpha=.3)\n    return pn.pane.Matplotlib(fig, tight=True, dpi=110)\n\ndef stats(days, times, smoker, size, bill):\n    df = filtered(days, times, smoker, size, bill)\n    if df.empty:\n        return pn.pane.Alert('\u041d\u0435\u0442 \u0434\u0430\u043d\u043d\u044b\u0445 \u0434\u043b\u044f \u0432\u044b\u0431\u0440\u0430\u043d\u043d\u044b\u0445 \u0444\u0438\u043b\u044c\u0442\u0440\u043e\u0432', alert_type='warning')\n    return pn.Row(pn.indicators.Number(name='\u0417\u0430\u043a\u0430\u0437\u043e\u0432', value=len(df), format='{value}'),\n                  pn.indicators.Number(name='\u0421\u0440\u0435\u0434\u043d\u0438\u0439 \u0447\u0435\u043a, $', value=round(df.total_bill.mean(),2), format='{value}'),\n                  pn.indicators.Number(name='\u0421\u0440\u0435\u0434\u043d\u0438\u0435 \u0447\u0430\u0435\u0432\u044b\u0435, %', value=round(df.tip_pct.mean(),2), format='{value}'))\n\ndef table(days, times, smoker, size, bill):\n    return pn.widgets.Tabulator(filtered(days, times, smoker, size, bill), pagination='local', page_size=10, show_index=False, disabled=True)\n\nargs = dict(days=days, times=times, smoker=smoker, size=size, bill=bill)\n_pn__state._cell_outputs['60686d2b'].append("""## 4. \u041a\u043e\u043c\u043f\u043e\u043d\u043e\u0432\u043a\u0430: \u0431\u043e\u043a\u043e\u0432\u0430\u044f \u043f\u0430\u043d\u0435\u043b\u044c \u0438 \u0432\u043a\u043b\u0430\u0434\u043a\u0438\n\`pn.template.FastListTemplate\` \u0437\u0430\u0434\u0430\u0451\u0442 \u0437\u0430\u0433\u043e\u043b\u043e\u0432\u043e\u043a \u0438 \u0431\u043e\u043a\u043e\u0432\u0443\u044e \u043f\u0430\u043d\u0435\u043b\u044c \u0441 \u0444\u0438\u043b\u044c\u0442\u0440\u0430\u043c\u0438; \u043e\u0441\u043d\u043e\u0432\u043d\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c \u2014 \u0432\u043a\u043b\u0430\u0434\u043a\u0438 \xab\u041e\u0431\u0437\u043e\u0440\xbb, \xab\u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430\xbb \u0438 \xab\u0414\u0430\u043d\u043d\u044b\u0435\xbb.""")\ntabs = pn.Tabs(\n    ('\u041e\u0431\u0437\u043e\u0440',    pn.Column(pn.bind(stats, **args), pn.bind(by_day, **args))),\n    ('\u0414\u0438\u0430\u0433\u0440\u0430\u043c\u043c\u0430', pn.Column(pn.Row(color_by, y_axis), pn.bind(scatter, **args, color_by=color_by, y_axis=y_axis))),\n    ('\u0414\u0430\u043d\u043d\u044b\u0435',   pn.bind(table, **args)),\n    dynamic=True)\n\napp = pn.template.FastListTemplate(\n    title='\u0427\u0430\u0435\u0432\u044b\u0435 \u0432 \u0440\u0435\u0441\u0442\u043e\u0440\u0430\u043d\u0435 \u2014 Panel App',\n    sidebar=[pn.pane.Markdown('### \u0424\u0438\u043b\u044c\u0442\u0440\u044b'), days, times, smoker, size, bill],\n    main=[tabs], accent='#4c78a8')\napp.servable();\n_pn__state._cell_outputs['33f49594'].append("""## 5. \u0417\u0430\u043f\u0443\u0441\u043a, \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u043d\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u0438 \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u044f\n* \u041b\u043e\u043a\u0430\u043b\u044c\u043d\u043e: \`panel serve panel_app.ipynb --show\` (\u043e\u0442\u043a\u0440\u043e\u0435\u0442\u0441\u044f http://localhost:5006/panel_app).\n* **Share** \u0432 Jupyter/Anaconda Notebooks: *Share \u2192 Publish/Share link* \u043f\u043e\u0437\u0432\u043e\u043b\u044f\u0435\u0442 \u0432\u044b\u0434\u0430\u0442\u044c \u0434\u043e\u0441\u0442\u0443\u043f \u0434\u0440\u0443\u0433\u0438\u043c \u043f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044f\u043c \u043a \u043d\u043e\u0443\u0442\u0431\u0443\u043a\u0443 \u0438 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d\u043d\u043e\u0439 \u043f\u0430\u043d\u0435\u043b\u0438; \u0432 \u0434\u0430\u043d\u043d\u043e\u0439 \u0441\u0440\u0435\u0434\u0435 (\u0431\u0435\u0437 \u0434\u043e\u0441\u0442\u0443\u043f\u0430 \u043a \u043e\u0431\u043b\u0430\u0447\u043d\u043e\u043c\u0443 \u0441\u0435\u0440\u0432\u0438\u0441\u0443) \u044d\u0442\u0430 \u0444\u0443\u043d\u043a\u0446\u0438\u044f \u043d\u0435\u0434\u043e\u0441\u0442\u0443\u043f\u043d\u0430, \u043f\u043e\u044d\u0442\u043e\u043c\u0443 \u0441\u043e\u0432\u043c\u0435\u0441\u0442\u043d\u044b\u0439 \u0434\u043e\u0441\u0442\u0443\u043f \u043e\u0431\u0435\u0441\u043f\u0435\u0447\u0438\u0432\u0430\u0435\u0442\u0441\u044f \u043f\u0443\u0431\u043b\u0438\u043a\u0430\u0446\u0438\u0435\u0439 \u0440\u0435\u043f\u043e\u0437\u0438\u0442\u043e\u0440\u0438\u044f \u0438 \u0441\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u043e\u0439 \u0441\u0431\u043e\u0440\u043a\u043e\u0439 \u043f\u0430\u043d\u0435\u043b\u0438 (\u0441\u043c. \`github_pages_steps.md\`).\n* \u0421\u0442\u0430\u0442\u0438\u0447\u0435\u0441\u043a\u0430\u044f \u0432\u0435\u0440\u0441\u0438\u044f \u0434\u043b\u044f GitHub Pages: \`panel convert panel_app.ipynb --to pyodide-worker --out docs\`.""")\n\nawait write_doc()`)
    self.postMessage({
      type: 'render',
      docs_json: docs_json,
      render_items: render_items,
      root_ids: root_ids
    })
  } catch(e) {
    const traceback = `${e}`
    const tblines = traceback.split('\n')
    self.postMessage({
      type: 'status',
      msg: tblines[tblines.length-2]
    });
    throw e
  }
}

self.onmessage = async (event) => {
  const msg = event.data
  if (msg.type === 'rendered') {
    self.pyodide.runPythonAsync(`
    from panel.io.state import state
    from panel.io.pyodide import _link_docs_worker

    _link_docs_worker(state.curdoc, sendPatch, setter='js')
    `)
  } else if (msg.type === 'patch') {
    self.pyodide.globals.set('patch', msg.patch)
    self.pyodide.runPythonAsync(`
    from panel.io.pyodide import _convert_json_patch
    state.curdoc.apply_json_patch(_convert_json_patch(patch), setter='js')
    `)
    self.postMessage({type: 'idle'})
  } else if (msg.type === 'location') {
    self.pyodide.globals.set('location', msg.location)
    self.pyodide.runPythonAsync(`
    import json
    from panel.io.state import state
    from panel.util import edit_readonly
    if state.location:
        loc_data = json.loads(location)
        with edit_readonly(state.location):
            state.location.param.update({
                k: v for k, v in loc_data.items() if k in state.location.param
            })
    `)
  }
}

startApplication()