    const samples = [
      {
        name: "CJK 地區字形",
        text: `直 骨 角 曜 令 今 冷 內 冊 青 清 晴 情 變 邊 過 道 選
海 活 沒 益 祝 神 福 社 祖 禮 祕
台 臺 國 図 图 圖 学 學 体 體 叶 葉
門 閒 關 開 骨 直 內 台 國 語 變 邊 門 體`
      },
      {
        name: "台語漢字",
        text: `𬦰 𡳞 脬 𡳞脬 𠊎 𫣆
囡仔 毋 捌 袂 予 伊 佇 欲 莫 彼 个
一寡代誌，阮今仔日欲來試字。`
      },
      {
        name: "台羅 / 白話字",
        text: `Tâi-gí Tâi-uân lâng tsit-má beh khì ha̍k-hāu.
phah-tshut lâi, bô-bé, tshìnn, huē, ū
Tâi-oân ê lâng, Chhit-gue̍h, góa beh khì.
Chhiúⁿ, o͘,ⁿ, ó͘, o͘h
a̍ e̍ i̍ o̍ u̍ m̍ n̍ A̍ E̍ I̍ O̍ U̍`
      },
      {
        name: "客語",
        text: `𠊎 𫣆 佢 哋 仔 毋 係
Ngài he Hak-kâ-ngìn. Sṳ́-ngìn, ngì, ngîn.
𠊎講客，汝講麼个？`
      },
      {
        name: "方音符號",
        text: `ㄅ ㄆ ㄇ ㄈ ㄉ ㄊ ㄋ ㄌ ㄍ ㄎ ㄏ ㄐ ㄑ ㄒ ㄓ ㄔ ㄕ ㄖ ㄗ ㄘ ㄙ
ㆠ ㆡ ㆢ ㆣ ㆤ ㆥ ㆦ ㆧ ㆨ ㆩ ㆪ ㆫ ㆬ ㆭ ㆮ ㆯ`
      },
      {
        name: "IPA",
        text: `ŋ ɲ ʔ ɕ ʑ ɾ ɻ ɨ ɯ ə ɤ ɔ ɛ ɑ ɐ
˥ ˦ ˧ ˨ ˩ ¹ ² ³ ⁴ ⁵
ˈ ˌ ː ʰ ʲ ʷ ̃ ̩ ̥ ̚`
      },
      {
        name: "完整樣本",
        text: `直 骨 角 曜 令 今 冷 內 冊 青 清 晴 情 變 邊 過 道 選
台 臺 國 図 图 圖 学 學 体 體 叶 葉

𬦰 𡳞脬 𠊎 𫣆 囡仔 毋 捌 袂

Tâi-gí Tâi-uân lâng tsit-má beh khì ha̍k-hāu.
Tâi-oân ê lâng, Chhit-gue̍h, góa beh khì. o͘ ⁿ
Ngài he Hak-kâ-ngìn. Sṳ́-ngìn, ngì, ngîn.

ㆠ ㆡ ㆢ ㆣ ㆤ ㆥ ㆦ ㆧ ㆨ ㆩ ㆪ ㆫ ㆬ ㆭ ㆮ ㆯ
ŋ ɲ ʔ ɕ ʑ ɾ ɻ ɨ ɯ ə ɤ ɔ ɛ ɑ ɐ ˥ ˦ ˧ ˨ ˩`
      }
    ];

    const initialFonts = [
      { name: "PingFang TC", family: "PingFang TC", source: "系統字型", origin: "system", defaultFamily: true },
      { name: "Noto Sans TC", family: "Noto Sans TC", source: "外部字型", origin: "external", defaultFamily: true }
    ];

    const fontSources = [
      {
        id: "system",
        label: "系統字型",
        path: "/System/Library/Fonts",
        kind: "system-library",
        recursive: false,
        enabled: true
      },
      {
        id: "supplemental",
        label: "系統補充字型",
        path: "/System/Library/Fonts/Supplemental",
        kind: "system-library",
        recursive: true,
        enabled: true
      },
      {
        id: "user",
        label: "使用者字型",
        path: "/Users/jacques/Library/Fonts",
        kind: "user-library",
        recursive: true,
        enabled: true
      }
    ];

    function defaultFontCards() {
      return initialFonts.map((font) => ({ ...font }));
    }

    const state = {
      fonts: defaultFontCards(),
      sample: samples[0].text,
      fontSize: 30,
      lang: "zh-Hant-TW",
      previewWeight: "",
      previewStyle: ""
    };

    const sampleSelect = document.querySelector("#sampleSelect");
    const sampleText = document.querySelector("#sampleText");
    const fontSize = document.querySelector("#fontSize");
    const fontSizeNumber = document.querySelector("#fontSizeNumber");
    const langSelect = document.querySelector("#langSelect");
    const appShell = document.querySelector("#appShell");
    const chooseFontFiles = document.querySelector("#chooseFontFiles");
    const chooseFontFolder = document.querySelector("#chooseFontFolder");
    const fontFiles = document.querySelector("#fontFiles");
    const fontFolder = document.querySelector("#fontFolder");
    const fontList = document.querySelector("#fontList");
    const stats = document.querySelector("#stats");
    const loadStatus = document.querySelector("#loadStatus");
    const dropZone = document.querySelector("#dropZone");
    const fontSourceList = document.querySelector("#fontSourceList");
    const scanLibrary = document.querySelector("#scanLibrary");
    const addSelectedFonts = document.querySelector("#addSelectedFonts");
    const removeSelectedFonts = document.querySelector("#removeSelectedFonts");
    const clearLibrarySelection = document.querySelector("#clearLibrarySelection");
    const librarySearch = document.querySelector("#librarySearch");
    const weightSelect = document.querySelector("#weightSelect");
    const styleSelect = document.querySelector("#styleSelect");
    const libraryList = document.querySelector("#libraryList");
    const libraryStatus = document.querySelector("#libraryStatus");
    const toggleSidebar = document.querySelector("#toggleSidebar");
    const scrollSyncToggle = document.querySelector("#scrollSyncToggle");
    const template = document.querySelector("#fontCardTemplate");
    const fontSuffixes = new Set([".otf", ".ttf", ".ttc", ".otc", ".woff", ".woff2"]);
    const cardHeightMultiplier = 3;
    let draggedFontIndex = null;
    let pointerDrag = null;
    let libraryFonts = [];
    let fontServerBase = location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8765";
    let syncScrollEnabled = false;
    let isSyncingScroll = false;
    let syncedScrollLeft = 0;
    let renderToken = 0;
    const librarySelection = new Set();
    const coverageCache = new Map();
    const coveragePending = new Set();
    const segmenter = "Segmenter" in Intl ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;

    samples.forEach((sample, index) => {
      const option = document.createElement("option");
      option.value = String(index);
      option.textContent = sample.name;
      sampleSelect.append(option);
    });

    sampleText.value = state.sample;

    function renderFontSources() {
      fontSourceList.replaceChildren();
      for (const source of fontSources) {
        const row = document.createElement("label");
        row.className = "font-source-row";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = source.enabled;
        checkbox.addEventListener("change", () => {
          source.enabled = checkbox.checked;
        });

        const main = document.createElement("div");
        const title = document.createElement("div");
        title.className = "font-source-title";
        title.textContent = source.label;
        const path = document.createElement("div");
        path.className = "font-source-path";
        path.textContent = source.path;
        main.append(title, path);

        row.append(checkbox, main);
        fontSourceList.append(row);
      }
    }

    function cssString(value) {
      return `"${String(value).replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`;
    }

    function updateStats() {
      const chars = [...state.sample].filter((char) => !/\s/u.test(char));
      const unique = new Set(chars);
      stats.textContent = `${state.fonts.length} fonts · ${chars.length} chars · ${unique.size} unique`;
    }

    function chip(text) {
      const item = document.createElement("span");
      item.className = "chip";
      item.textContent = text;
      return item;
    }

    function fileKey(file) {
      return `${file.name}:${file.size}:${file.lastModified}`;
    }

    function isFontFile(file) {
      const dot = file.name.lastIndexOf(".");
      const suffix = dot >= 0 ? file.name.slice(dot).toLowerCase() : "";
      return fontSuffixes.has(suffix) || file.type.startsWith("font/");
    }

    function setStatus(message, isError = false) {
      loadStatus.textContent = message;
      loadStatus.classList.toggle("has-error", isError);
    }

    function setLibraryStatus(message, isError = false) {
      libraryStatus.textContent = message;
      libraryStatus.classList.toggle("has-error", isError);
    }

    function moveFont(fromIndex, toIndex) {
      if (fromIndex === toIndex || fromIndex == null || toIndex == null) return;
      const [font] = state.fonts.splice(fromIndex, 1);
      state.fonts.splice(toIndex, 0, font);
      render();
    }

    function cardIndexFromPoint(x, y) {
      const card = document.elementFromPoint(x, y)?.closest(".font-card");
      if (!card) return null;
      const index = Number(card.dataset.index);
      return Number.isInteger(index) ? index : null;
    }

    function clearDragMarkers() {
      document.querySelectorAll(".is-drag-over, .is-dragging").forEach((item) => {
        item.classList.remove("is-drag-over", "is-dragging");
      });
    }

    function sampleForDisplay() {
      return state.sample.replace(/\s*\n\s*/g, " ").trim();
    }

    function graphemes(text) {
      if (!segmenter) return [...text];
      return [...segmenter.segment(text)].map((part) => part.segment);
    }

    function serverFontKey(font) {
      return `server:${font.sourceId}:${font.path}:${font.index ?? ""}`;
    }

    function familyCardKey(font) {
      return `library-family:${displayFontFamily(font)}`;
    }

    function isFontAdded(key) {
      return state.fonts.some((font) => font.key === key || font.faces?.some((face) => face.key === key));
    }

    function resetFontsToDefault() {
      for (const font of state.fonts) {
        if (font.url?.startsWith("blob:")) URL.revokeObjectURL(font.url);
      }
      state.fonts = defaultFontCards();
      syncDefaultFontMetadata();
      librarySelection.clear();
      render();
      renderLibrary();
      setLibraryStatus("已恢復預設比較字型。");
    }

    function fontSearchText(font) {
      return [
        displayFontFamily(font),
        font.fullName,
        font.family,
        font.subfamily,
        font.typographicFamily,
        font.typographicSubfamily,
        font.file,
        font.weight,
        font.style
      ].join(" ").toLowerCase();
    }

    function filteredLibraryFonts() {
      const query = librarySearch.value.trim().toLowerCase();
      return libraryFonts
        .filter((font) => !query || fontSearchText(font).includes(query))
        .filter((font) => !state.previewWeight || String(font.weight) === state.previewWeight)
        .filter((font) => !state.previewStyle || font.style === state.previewStyle)
        .slice(0, 500);
    }

    function updateWeightOptions() {
      const previousWeight = weightSelect.value;
      const weights = [...new Set(libraryFonts.map((font) => String(font.weight)).filter(Boolean))]
        .sort((a, b) => Number(a) - Number(b));
      weightSelect.replaceChildren(new Option("全部", ""));
      for (const weight of weights) {
        weightSelect.append(new Option(weight, weight));
      }
      if (weights.includes(previousWeight)) weightSelect.value = previousWeight;
    }

    function displayFontFamily(font) {
      const raw = font.typographicFamily || font.family || font.fullName || font.file || "";
      return raw
        .replace(/\s+(Thin|Extra\s*Light|Ultra\s*Light|Light|Regular|Medium|Semi\s*Bold|Demi\s*Bold|Bold|Black|Heavy)$/i, "")
        .replace(/\s+(EL|L|R|M|N|SB|B|H)$/i, "")
        .trim() || raw;
    }

    function displaySubfamily(font) {
      return font.typographicSubfamily || font.subfamily || `${font.weight} ${font.style}`;
    }

    function isRegularFace(font) {
      const label = displaySubfamily(font).toLowerCase();
      return label === "regular" || (font.weight === 400 && font.style === "normal");
    }

    function compareFaces(a, b) {
      const regularDelta = Number(isRegularFace(b)) - Number(isRegularFace(a));
      if (regularDelta) return regularDelta;
      return a.weight - b.weight || a.style.localeCompare(b.style) || displaySubfamily(a).localeCompare(displaySubfamily(b));
    }

    function updateFamilySource(card) {
      if (!card.faces?.length) return;
      const subfamilies = [...new Set(card.faces.map((face) => face.subfamily))].join(", ");
      const sources = [...new Set(card.faces.map((face) => face.sourceLabel).filter(Boolean))].join(", ");
      card.source = `${card.faces.length} 款 · ${subfamilies}${sources ? ` · ${sources}` : ""}`;
    }

    function faceInfo(font) {
      return {
        key: serverFontKey(font),
        weight: font.weight,
        style: font.style,
        subfamily: displaySubfamily(font),
        file: font.file,
        sourceLabel: font.sourceLabel,
        sourceKind: font.sourceKind,
        index: font.index,
        path: font.path
      };
    }

    function fontMatchesCard(font, card) {
      return displayFontFamily(font) === card.name || font.family === card.name || font.typographicFamily === card.name;
    }

    function syncDefaultFontMetadata() {
      for (const card of state.fonts) {
        if (!card.defaultFamily) continue;
        const matches = libraryFonts.filter((font) => fontMatchesCard(font, card)).sort(compareFaces);
        if (!matches.length) continue;
        card.faces = matches.map(faceInfo);
        card.activeWeight = matches.find(isRegularFace)?.weight || matches[0].weight;
        card.activeStyle = matches.find(isRegularFace)?.style || matches[0].style;
        updateFamilySource(card);
      }
    }

    function cardWeights(card) {
      return [...new Set((card.faces || []).map((face) => face.weight).filter(Boolean))]
        .sort((a, b) => Number(a) - Number(b));
    }

    function cardStyles(card) {
      return [...new Set((card.faces || []).map((face) => face.style).filter(Boolean))];
    }

    function activeFace(font) {
      if (!font.faces?.length) return font.path ? font : null;
      const weight = state.previewWeight || font.activeWeight || "";
      const style = state.previewStyle || font.activeStyle || "";
      return font.faces.find((face) => (!weight || String(face.weight) === String(weight)) && (!style || face.style === style))
        || font.faces.find((face) => !weight || String(face.weight) === String(weight))
        || font.faces[0];
    }

    function coverageKey(face, text) {
      if (!face?.path) return "";
      return `${face.path}#${face.index ?? ""}#${text}`;
    }

    async function ensureCoverage(face, text, token) {
      const key = coverageKey(face, text);
      if (!key || coverageCache.has(key) || coveragePending.has(key)) return;

      coveragePending.add(key);
      let shouldRender = false;
      try {
        const url = `${fontServerBase}/api/coverage?path=${encodeURIComponent(face.path)}&index=${encodeURIComponent(face.index ?? "")}&text=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        coverageCache.set(key, new Set(data.missingCodepoints || []));
        shouldRender = true;
      } catch (error) {
        coverageCache.delete(key);
      } finally {
        coveragePending.delete(key);
      }
      if (shouldRender) render();
    }

    function renderSampleLine(line, font, text, token) {
      const face = activeFace(font);
      const key = coverageKey(face, text);
      const missing = key ? coverageCache.get(key) : null;

      if (key && !coverageCache.has(key)) {
        ensureCoverage(face, text, token);
      }

      if (coveragePending.has(key)) {
        line.dataset.coverage = "pending";
      }

      if (!(missing instanceof Set)) {
        line.textContent = text;
        return;
      }

      line.dataset.coverage = "ready";

      line.replaceChildren(...graphemes(text).map((segment) => {
        const span = document.createElement("span");
        span.textContent = segment;
        const isMissing = [...segment].some((char) => !/\s/u.test(char) && missing.has(char.codePointAt(0)));
        if (isMissing) span.className = "sample-missing";
        return span;
      }));
    }

    function cardHeightForFontSize(size) {
      return Math.max(64, Math.round(size * cardHeightMultiplier));
    }

    function sampleScrollers() {
      return [...document.querySelectorAll(".sample-text")];
    }

    function applySyncedScroll(source = null) {
      if (!syncScrollEnabled) return;
      isSyncingScroll = true;
      for (const scroller of sampleScrollers()) {
        if (scroller !== source) scroller.scrollLeft = syncedScrollLeft;
      }
      isSyncingScroll = false;
    }

    function updateScrollSyncButton() {
      scrollSyncToggle.classList.toggle("is-active", syncScrollEnabled);
      scrollSyncToggle.setAttribute("aria-pressed", String(syncScrollEnabled));
      scrollSyncToggle.textContent = syncScrollEnabled ? "同步捲動：開" : "同步捲動：關";
    }

    function renderLibrary({ preserveScroll = false } = {}) {
      const previousScrollTop = preserveScroll ? libraryList.scrollTop : 0;
      const filtered = filteredLibraryFonts();

      libraryList.replaceChildren();
      if (!filtered.length) {
        const empty = document.createElement("div");
        empty.className = "status";
        empty.textContent = libraryFonts.length ? "沒有符合搜尋的字型。" : "尚未掃描字型資料夾。";
        libraryList.append(empty);
        if (preserveScroll) libraryList.scrollTop = previousScrollTop;
        return;
      }

      const groups = new Map();
      for (const font of filtered) {
        const family = displayFontFamily(font);
        if (!groups.has(family)) groups.set(family, []);
        groups.get(family).push(font);
      }

      for (const [family, fonts] of [...groups.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
        const details = document.createElement("details");
        details.className = "library-family";
        details.open = filtered.length <= 60 || fonts.some((font) => librarySelection.has(serverFontKey(font)) || isFontAdded(serverFontKey(font)));

        const summary = document.createElement("summary");
        summary.className = "library-family-summary";
        const familyCheckbox = document.createElement("input");
        familyCheckbox.type = "checkbox";
        const familyKeys = fonts.map(serverFontKey);
        const selectedCount = familyKeys.filter((key) => librarySelection.has(key)).length;
        familyCheckbox.checked = selectedCount === familyKeys.length;
        familyCheckbox.indeterminate = selectedCount > 0 && selectedCount < familyKeys.length;
        familyCheckbox.addEventListener("click", (event) => {
          event.stopPropagation();
        });
        familyCheckbox.addEventListener("change", () => {
          for (const key of familyKeys) {
            if (familyCheckbox.checked) {
              librarySelection.add(key);
            } else {
              librarySelection.delete(key);
            }
          }
          renderLibrary({ preserveScroll: true });
        });
        const title = document.createElement("span");
        title.className = "library-family-title";
        title.textContent = family;
        const count = document.createElement("span");
        count.className = "library-family-count";
        count.textContent = `${fonts.length} 款`;
        const addFamily = document.createElement("button");
        addFamily.className = "library-add";
        addFamily.type = "button";
        addFamily.title = "加入整個字型家族";
        addFamily.setAttribute("aria-label", `加入 ${family}`);
        addFamily.textContent = "+";
        addFamily.addEventListener("click", async (event) => {
          event.preventDefault();
          event.stopPropagation();
          await addServerFonts(familyKeys);
        });
        summary.append(familyCheckbox, title, count, addFamily);

        const items = document.createElement("div");
        items.className = "library-family-items";

        for (const font of fonts.sort(compareFaces)) {
          const key = serverFontKey(font);
          const row = document.createElement("label");
          row.className = "library-row";
          row.classList.toggle("is-added", isFontAdded(key));

          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.checked = librarySelection.has(key);
          checkbox.addEventListener("change", () => {
            if (checkbox.checked) {
              librarySelection.add(key);
            } else {
              librarySelection.delete(key);
            }
          });

          const main = document.createElement("div");
          main.className = "library-row-main";
          const name = document.createElement("div");
          name.className = font.error ? "library-row-name library-row-error" : "library-row-name";
          name.textContent = displaySubfamily(font);
          const file = document.createElement("div");
          file.className = "library-row-file";
          file.textContent = font.error ? font.error : font.file;
          main.append(name, file);

          const weight = document.createElement("div");
          weight.className = "library-row-weight";
          weight.textContent = font.error ? "error" : `${font.weight} ${font.style}`;

          const addFace = document.createElement("button");
          addFace.className = "library-add";
          addFace.type = "button";
          addFace.title = "加入此字型";
          addFace.setAttribute("aria-label", `加入 ${family} ${displaySubfamily(font)}`);
          addFace.textContent = "+";
          addFace.addEventListener("click", async (event) => {
            event.preventDefault();
            event.stopPropagation();
            await addServerFonts([key]);
          });

          row.append(checkbox, main, weight, addFace);
          items.append(row);
        }

        details.append(summary, items);
        libraryList.append(details);
      }

      if (preserveScroll) {
        libraryList.scrollTop = previousScrollTop;
      }
    }

    async function scanFontLibrary() {
      const enabledSources = fontSources.filter((source) => source.enabled);
      if (!enabledSources.length) {
        libraryFonts = [];
        librarySelection.clear();
        updateWeightOptions();
        renderLibrary();
        setLibraryStatus("請至少選取一個字型庫來源。", true);
        return;
      }

      setLibraryStatus("掃描中...");
      try {
        const results = await Promise.all(enabledSources.map(async (source) => {
          const recursive = source.recursive === false ? "0" : "1";
          const response = await fetch(`${fontServerBase}/api/fonts?dir=${encodeURIComponent(source.path)}&recursive=${recursive}`);
          if (!response.ok) throw new Error(`${source.label}: HTTP ${response.status}`);
          const data = await response.json();
          return { source, data };
        }));

        libraryFonts = results.flatMap(({ source, data }) => data.fonts
          .filter((font) => !font.error)
          .map((font) => ({
            ...font,
            sourceId: source.id,
            sourceLabel: source.label,
            sourceKind: source.kind,
            sourceDirectory: data.directory
          })));
        const total = results.reduce((sum, result) => sum + result.data.fonts.length, 0);
        const failed = total - libraryFonts.length;
        librarySelection.clear();
        updateWeightOptions();
        syncDefaultFontMetadata();
        renderLibrary();
        render();
        const parts = [`${enabledSources.length} 個來源`, `${libraryFonts.length} 個字型`];
        if (failed) parts.push(`${failed} 個無法讀取`);
        setLibraryStatus(parts.join(" · "), failed > 0);
      } catch (error) {
        setLibraryStatus(`無法掃描字型庫：${error.message}`, true);
      }
    }

    async function addServerFonts(keys) {
      let added = 0;
      let skipped = 0;
      let failed = 0;

      for (const key of keys) {
        if (isFontAdded(key)) {
          skipped += 1;
          continue;
        }

        const font = libraryFonts.find((item) => serverFontKey(item) === key);
        if (!font) continue;

        const cardKey = familyCardKey(font);
        let card = state.fonts.find((item) => item.key === cardKey);
        if (!card) {
          card = {
            name: displayFontFamily(font),
            family: `ServerFamily-${crypto.randomUUID()}`,
            source: "",
            key: cardKey,
            origin: "library",
            faces: []
          };
          state.fonts.push(card);
        }

        const url = `${fontServerBase}/font?path=${encodeURIComponent(font.path)}`;

        try {
          const face = new FontFace(card.family, `url(${url})`, {
            style: font.style,
            weight: String(font.weight)
          });
          await face.load();
          document.fonts.add(face);
          card.faces.push({
            key,
            weight: font.weight,
            style: font.style,
            subfamily: displaySubfamily(font),
            file: font.file,
            sourceLabel: font.sourceLabel,
            sourceKind: font.sourceKind,
            index: font.index,
            path: font.path,
            url
          });
          card.activeWeight ||= font.weight;
          card.activeStyle ||= font.style;
          updateFamilySource(card);
          added += 1;
        } catch (error) {
          if (!card.faces.length) {
            state.fonts = state.fonts.filter((item) => item !== card);
          }
          failed += 1;
        }
      }

      render();
      renderLibrary();
      const parts = [];
      if (added) parts.push(`加入 ${added} 個`);
      if (skipped) parts.push(`略過 ${skipped} 個已加入`);
      if (failed) parts.push(`${failed} 個載入失敗`);
      setLibraryStatus(parts.join("，") || "沒有新增字型。", failed > 0);
    }

    function removeServerFonts(keys) {
      let removed = 0;
      for (const card of state.fonts) {
        if (!card.faces) continue;
        const before = card.faces.length;
        card.faces = card.faces.filter((face) => !keys.includes(face.key));
        removed += before - card.faces.length;
        updateFamilySource(card);
      }
      state.fonts = state.fonts.filter((font) => !font.faces || font.faces.length > 0);
      render();
      renderLibrary();
      setLibraryStatus(`移除 ${removed} 個 family face。`);
    }

    async function addFontFiles(fileList) {
      const files = [...fileList].filter(isFontFile);
      if (!files.length) {
        setStatus("沒有找到可載入的字型檔。", true);
        return;
      }

      let added = 0;
      let skipped = 0;
      const failed = [];

      for (const file of files) {
        const key = fileKey(file);
        if (state.fonts.some((font) => font.key === key)) {
          skipped += 1;
          continue;
        }

        const family = `LocalFont-${crypto.randomUUID()}`;
        const url = URL.createObjectURL(file);
        const sourceName = file.webkitRelativePath || file.name;

        try {
          const face = new FontFace(family, `url(${url})`);
          await face.load();
          document.fonts.add(face);
          state.fonts.push({ name: file.name, family, source: sourceName, key, url, origin: "uploaded" });
          added += 1;
        } catch (error) {
          URL.revokeObjectURL(url);
          failed.push(file.name);
        }
      }

      render();
      renderLibrary();

      const parts = [];
      if (added) parts.push(`加入 ${added} 個字型`);
      if (skipped) parts.push(`略過 ${skipped} 個重複檔`);
      if (failed.length) parts.push(`無法載入：${failed.slice(0, 4).join(", ")}`);
      setStatus(parts.join("，") || "沒有新增字型。", failed.length > 0);
    }

    function render() {
      const token = ++renderToken;
      document.documentElement.style.setProperty("--sample-size", `${state.fontSize}px`);
      document.documentElement.style.setProperty("--card-height", `${cardHeightForFontSize(state.fontSize)}px`);
      fontList.replaceChildren();

      state.fonts.forEach((font, index) => {
        const node = template.content.firstElementChild.cloneNode(true);
        node.dataset.index = String(index);
        const origin = font.origin || (font.path ? "library" : font.url ? "uploaded" : "system");
        node.classList.add(`is-${origin}`);
        const head = node.querySelector(".font-head");
        head.draggable = true;
        head.dataset.index = String(index);
        node.querySelector(".font-name").textContent = font.name;
        const subtitle = node.querySelector(".font-subtitle");
        const activeFilters = [];
        if (state.previewWeight) activeFilters.push(state.previewWeight);
        if (state.previewStyle) activeFilters.push(state.previewStyle === "normal" ? "正體" : "斜體");
        subtitle.textContent = activeFilters.join(" · ");
        subtitle.hidden = activeFilters.length === 0;
        node.querySelector(".font-tooltip-source").textContent = font.source;
        const meta = node.querySelector(".font-tooltip-meta");
        const metaItems = [];
        const weights = cardWeights(font);
        const styles = cardStyles(font);
        if (weights.length) metaItems.push(chip(weights.join("/")));
        if (styles.length && styles.some((style) => style !== "normal")) metaItems.push(chip(styles.join("/")));
        if (!weights.length && font.weight) metaItems.push(chip(String(font.weight)));
        if (!weights.length && font.subfamily) metaItems.push(chip(font.subfamily));
        if (!styles.length && font.style && font.style !== "normal") metaItems.push(chip(font.style));
        if (font.path || font.faces) metaItems.push(chip("library"));
        if (font.faces) metaItems.push(chip("family"));
        meta.replaceChildren(...metaItems);

        const text = node.querySelector(".sample-text");
        const line = node.querySelector(".sample-line");
        const sample = sampleForDisplay();
        renderSampleLine(line, font, sample, token);
        text.lang = state.lang;
        line.style.fontFamily = `${cssString(font.family)}, "Noto Sans CJK TC", "Noto Sans TC", sans-serif`;
        const face = activeFace(font);
        const renderWeight = state.previewWeight || face?.weight || font.activeWeight || font.weight || "";
        const renderStyle = state.previewStyle || face?.style || font.activeStyle || font.style || "";
        if (renderWeight) line.style.fontWeight = String(renderWeight);
        if (renderStyle) line.style.fontStyle = renderStyle;
        text.scrollLeft = syncedScrollLeft;
        text.addEventListener("scroll", () => {
          if (!syncScrollEnabled || isSyncingScroll) return;
          syncedScrollLeft = text.scrollLeft;
          applySyncedScroll(text);
        });

        node.querySelector(".remove").addEventListener("click", () => {
          if (font.url?.startsWith("blob:")) URL.revokeObjectURL(font.url);
          state.fonts.splice(index, 1);
          render();
          renderLibrary();
        });

        head.addEventListener("dragstart", (event) => {
          draggedFontIndex = index;
          node.classList.add("is-dragging");
          event.dataTransfer.effectAllowed = "move";
          event.dataTransfer.setData("text/plain", String(index));
        });

        head.addEventListener("dragend", () => {
          draggedFontIndex = null;
          clearDragMarkers();
        });

        head.addEventListener("pointerdown", (event) => {
          if (event.target.closest("button")) return;
          if (event.button !== 0) return;
          pointerDrag = { fromIndex: index };
          node.classList.add("is-dragging");
          event.preventDefault();
        });

        node.addEventListener("dragover", (event) => {
          if (draggedFontIndex == null) return;
          event.preventDefault();
          event.dataTransfer.dropEffect = "move";
          node.classList.add("is-drag-over");
        });

        node.addEventListener("dragleave", () => {
          node.classList.remove("is-drag-over");
        });

        node.addEventListener("drop", (event) => {
          if (draggedFontIndex == null) return;
          event.preventDefault();
          moveFont(draggedFontIndex, index);
        });

        fontList.append(node);
      });

      updateStats();
      applySyncedScroll();
    }

    sampleSelect.addEventListener("change", () => {
      state.sample = samples[Number(sampleSelect.value)].text;
      sampleText.value = state.sample;
      render();
    });

    sampleText.addEventListener("input", () => {
      state.sample = sampleText.value;
      render();
    });

    function setFontSize(value) {
      const next = Math.max(16, Math.min(72, Number(value) || 30));
      state.fontSize = next;
      fontSize.value = String(next);
      fontSizeNumber.value = String(next);
      render();
    }

    fontSize.addEventListener("input", () => setFontSize(fontSize.value));
    fontSizeNumber.addEventListener("input", () => setFontSize(fontSizeNumber.value));

    langSelect.addEventListener("change", () => {
      state.lang = langSelect.value;
      render();
    });

    scanLibrary.addEventListener("click", scanFontLibrary);

    addSelectedFonts.addEventListener("click", async () => {
      await addServerFonts([...librarySelection]);
    });

    removeSelectedFonts.addEventListener("click", () => {
      resetFontsToDefault();
    });

    clearLibrarySelection.addEventListener("click", () => {
      librarySelection.clear();
      renderLibrary();
    });

    librarySearch.addEventListener("input", renderLibrary);

    weightSelect.addEventListener("change", () => {
      state.previewWeight = weightSelect.value;
      renderLibrary();
      render();
    });

    styleSelect.addEventListener("change", () => {
      state.previewStyle = styleSelect.value;
      renderLibrary();
      render();
    });

    scrollSyncToggle.addEventListener("click", () => {
      syncScrollEnabled = !syncScrollEnabled;
      if (syncScrollEnabled) {
        syncedScrollLeft = sampleScrollers()[0]?.scrollLeft || 0;
        applySyncedScroll();
      }
      updateScrollSyncButton();
    });

    chooseFontFiles.addEventListener("click", () => {
      fontFiles.value = "";
      fontFiles.click();
    });

    chooseFontFolder.addEventListener("click", () => {
      fontFolder.value = "";
      fontFolder.click();
    });

    toggleSidebar.addEventListener("click", () => {
      const collapsed = appShell.classList.toggle("is-sidebar-collapsed");
      toggleSidebar.textContent = collapsed ? "›" : "‹";
      toggleSidebar.setAttribute("aria-label", collapsed ? "展開側欄" : "收合側欄");
      toggleSidebar.title = collapsed ? "展開側欄" : "收合側欄";
    });

    fontFiles.addEventListener("change", async () => {
      await addFontFiles(fontFiles.files);
      fontFiles.value = "";
    });

    fontFolder.addEventListener("change", async () => {
      await addFontFiles(fontFolder.files);
      fontFolder.value = "";
    });

    function eventHasFiles(event) {
      return [...event.dataTransfer.types].includes("Files");
    }

    document.addEventListener("dragover", (event) => {
      if (!eventHasFiles(event)) return;
      event.preventDefault();
      document.body.classList.add("is-file-dragging");
    });

    document.addEventListener("dragleave", (event) => {
      if (event.relatedTarget) return;
      document.body.classList.remove("is-file-dragging");
    });

    document.addEventListener("drop", async (event) => {
      if (!eventHasFiles(event)) return;
      event.preventDefault();
      document.body.classList.remove("is-file-dragging");
      dropZone.classList.remove("is-dragging");
      await addFontFiles(event.dataTransfer.files);
    });

    dropZone.addEventListener("dragenter", (event) => {
      if (!eventHasFiles(event)) return;
      event.preventDefault();
      dropZone.classList.add("is-dragging");
    });

    dropZone.addEventListener("dragleave", () => {
      dropZone.classList.remove("is-dragging");
    });

    document.addEventListener("pointermove", (event) => {
      if (!pointerDrag) return;
      clearDragMarkers();
      const targetIndex = cardIndexFromPoint(event.clientX, event.clientY);
      if (targetIndex == null) return;
      const target = document.querySelector(`.font-card[data-index="${targetIndex}"]`);
      target?.classList.add("is-drag-over");
    });

    document.addEventListener("pointerup", (event) => {
      if (!pointerDrag) return;
      const fromIndex = pointerDrag.fromIndex;
      const targetIndex = cardIndexFromPoint(event.clientX, event.clientY);
      pointerDrag = null;
      clearDragMarkers();
      if (targetIndex == null) return;
      moveFont(fromIndex, targetIndex);
    });

    render();
    renderFontSources();
    renderLibrary();
    updateScrollSyncButton();
    scanFontLibrary();
