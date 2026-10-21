const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const SAVE_KEY = "blackthorn-manor-demo-v3";

const evidenceCatalog = {
  letter: { title: "第十三封信", tag: "文件 / 花粉", image: "assets/evidence/letter.jpg", marker: [77, 72], body: "匿名信警告死者不要相信替他配药的人。信纸带有淡淡药草气味，角落附着紫色花粉。", discovery: "封蜡裂口里卡着紫色花粉，与温室失踪的毛地黄完全一致。" },
  call: { title: "匿名电话录音", tag: "证词 / 时间", image: "assets/evidence/call.jpg", marker: [69, 59], body: "来电者声称书房座钟被拨慢十二分钟。布莱克医生每晚负责替那座钟上发条。", discovery: "录音带背面写着“－12”，来电者并非猜测，而是亲眼见过被修改的钟。" },
  clock: { title: "停摆的书房座钟", tag: "物证 / 时间", image: "assets/evidence/clock.jpg", marker: [51, 62], body: "钟面停在10:28，擒纵叉却有刚被人为调整过的划痕。真实死亡时间比鉴定时间早十二分钟。", discovery: "机芯调速杆上有新鲜金属划痕：它被人故意拨慢了十二分钟。" },
  foxglove: { title: "缺失的毛地黄", tag: "物证 / 毒物", image: "assets/evidence/foxglove.jpg", marker: [62, 76], body: "温室里少了一株毛地黄。其提取物可以扰乱心率，也是匿名信上紫色花粉的来源。", discovery: "剪刀刃口粘着尚未干透的汁液，切口形成时间就在昨夜。" },
  mud: { title: "旧式医疗箱", tag: "物证 / 所属", image: "assets/evidence/medical-bag.jpg", marker: [73, 78], body: "船屋泥地里发现一枚刻有 A.B. 的箱扣，与布莱克医生的旧式医疗箱完全吻合。", discovery: "脱落的黄铜扣刻着 A.B.，箱底红褐色泥土只可能来自温室。" },
  ledger: { title: "门房出入簿", tag: "记录 / 不在场证明", image: "assets/evidence/ledger.jpg", marker: [69, 61], body: "暴雪封路后没有车辆离开庄园。医生所谓的“九点出诊”不可能发生。", discovery: "九点后的记录整页空白，墨水也已冻结；没有人能在事后补写一条出门记录。" },
  earring: { title: "珍珠耳坠", tag: "物证 / 证词", image: "assets/evidence/earring.jpg", marker: [55, 68], body: "伊芙琳遗失的耳坠落在礼拜堂，但旁边蜡烛只燃烧了约二十分钟——她没有整晚待在那里。", discovery: "耳扣缠着一根暗红羊毛线，与医生昨夜佩戴的围巾颜色一致。" }
};

const characters = {
  evelyn: { name: "伊芙琳·维恩", role: "侄女 · 遗产继承人", image: "assets/characters/evelyn.png", note: "敏锐而克制。声称案发时一直在礼拜堂，却似乎在保护某个人。", pitch: 1.03, rate: 1.01 },
  hall: { name: "塞缪尔·霍尔", role: "管家 · 第一发现人", image: "assets/characters/hall.png", note: "在庄园服务三十年。知道每一扇门，也知道这个家族最不愿被揭开的秘密。", pitch: .93, rate: .94 },
  blake: { name: "亚瑟·布莱克", role: "家庭医生 · 死亡鉴定人", image: "assets/characters/blake.png", note: "负责爵士的心脏用药。他温和、准确，却对时间表现得过分笃定。", pitch: .98, rate: .98 }
};

const locations = {
  manor: {
    title: "西翼书房", kicker: "WEST WING · CRIME SCENE", background: "assets/locations/manor-study.jpg",
    description: "命案现场仍保持原样。书房座钟、药瓶和壁炉里的残纸构成了一条互相矛盾的时间线。",
    character: "hall", talkAt: { left: 67, top: 46 }, dialogue: "manor",
    hotspots: [
      { id: "clock", label: "检查停摆座钟", left: 11, top: 45, type: "evidence", evidence: "clock", note: "玻璃门内侧有新鲜指纹，擒纵叉上留下金属工具划痕。" },
      { id: "desk", label: "查看死者书桌", left: 46, top: 55, type: "observe", note: "墨水已经干透。抽屉里少了一页最新遗嘱，但锁没有被撬过。" },
      { id: "medicine", label: "观察药瓶", left: 70, top: 61, type: "observe", note: "标签写着每日睡前十滴。瓶塞却残留着一种甜涩的植物气味。" }
    ]
  },
  glasshouse: {
    title: "玻璃温室", kicker: "THE CONSERVATORY", background: "assets/locations/glasshouse.jpg",
    description: "湿热空气与窗外暴雪形成诡异反差。有人匆忙移动过花盆，并把工具擦得过分干净。",
    character: "blake", talkAt: { left: 72, top: 45 }, dialogue: "glasshouse",
    hotspots: [
      { id: "planter", label: "检查空花盆", left: 45, top: 72, type: "evidence", evidence: "foxglove", note: "花盆边缘残留紫色花粉，根部切口十分整齐。" },
      { id: "cabinet", label: "查看药品柜", left: 89, top: 43, type: "observe", note: "柜门上锁，锁眼周围没有撬动痕迹。只有医生和爵士持有钥匙。" },
      { id: "tools", label: "检视园艺工具", left: 67, top: 70, type: "observe", note: "剪刀刚被清洗过，铰链缝隙中却还卡着一点紫色纤维。" }
    ]
  },
  boathouse: {
    title: "湖畔船屋", kicker: "FROZEN LAKE · BOATHOUSE", background: "assets/locations/boathouse.jpg",
    description: "结冰的湖水拍打木桩。泥泞脚印从庄园方向延伸至此，却没有返回的痕迹。",
    character: "blake", talkAt: { left: 75, top: 48 }, dialogue: "boathouse",
    hotspots: [
      { id: "medical-bag", label: "检查旧医疗箱", left: 18, top: 58, type: "evidence", evidence: "mud", note: "箱扣缺失，皮革上沾着温室特有的红褐色培养土。" },
      { id: "footprints", label: "比对泥脚印", left: 48, top: 74, type: "observe", note: "脚印在栈桥尽头突然消失，像是有人换了一双提前藏好的鞋。" },
      { id: "boat", label: "搜查划艇", left: 82, top: 64, type: "observe", note: "船底是干的。昨夜没有人真正划船离开，这里更像一个处理证物的地点。" }
    ]
  },
  gate: {
    title: "庄园门房", kicker: "NORTH GATE · ENTRY LOG", background: "assets/locations/gatehouse.jpg",
    description: "铁门外车辙已经被雪覆盖。门房的记录、钥匙和电话可以证明谁真正离开过庄园。",
    character: "hall", talkAt: { left: 23, top: 48 }, dialogue: "gate",
    hotspots: [
      { id: "ledger", label: "核对出入簿", left: 54, top: 72, type: "evidence", evidence: "ledger", note: "最后一次开门记录是傍晚六点。九点之后，铁门一直没有开启。" },
      { id: "keys", label: "检查钥匙墙", left: 13, top: 35, type: "observe", note: "温室备用钥匙的位置空着。标签上的灰尘轮廓显示，它最近刚被取走。" },
      { id: "telephone", label: "查看门房电话", left: 37, top: 44, type: "observe", note: "电话线被人为拔下，门房昨夜根本无法替医生联系所谓的急诊病人。" }
    ]
  },
  chapel: {
    title: "家族礼拜堂", kicker: "PRIVATE CHAPEL · EAST GROUNDS", background: "assets/locations/chapel.jpg",
    description: "礼拜堂里仍残留熄灭蜡烛的烟。伊芙琳的祈祷并没有她所声称的那么漫长。",
    character: "evelyn", talkAt: { left: 70, top: 47 }, dialogue: "chapel",
    hotspots: [
      { id: "earring", label: "拾起珍珠耳坠", left: 27, top: 81, type: "evidence", evidence: "earring", note: "耳坠属于伊芙琳，但蜡油长度证明她只在礼拜堂停留了不到二十分钟。" },
      { id: "candle", label: "检查熄灭蜡烛", left: 32, top: 74, type: "observe", note: "灯芯仍有余温。以燃烧速度判断，它在十点前就已经熄灭。" },
      { id: "crypt", label: "查看家族墓室", left: 65, top: 42, type: "observe", note: "墓室门锁着，门缝里压着一小片与第十三封信相同的纸张。" }
    ]
  }
};

const dialogues = {
  manor: [
    { speaker: "hall", text: "您终于来了。爵士就坐在那张椅子上，像睡着了一样。门从里面锁着——我发誓，没有任何人进出。" },
    { speaker: "player", text: "你发现尸体时，书房座钟显示几点？" },
    { speaker: "hall", text: "十点二十八分。可走廊的大钟已经敲过十点四十分了。我当时以为是书房的钟又慢了。", choices: [
      { text: "“又”慢了？它以前也出过问题？", response: "只有布莱克医生碰过它。爵士手抖以后，每周都是医生替他上发条。", relation: 1 },
      { text: "你为什么没有立刻告诉警察？", response: "因为维恩家靠沉默活了三十年。可现在继续沉默，只会让另一个人死去。", relation: 2 }
    ] },
    { speaker: "hall", text: "还有一件事：壁炉里的信不是爵士烧的。他从不用蓝色火柴，而灰烬里有一根蓝色火柴梗。" }
  ],
  glasshouse: [
    { speaker: "blake", text: "温室不适合夜间散步，调查员。很多看似美丽的东西，只需要几滴就能让心脏停止。" },
    { speaker: "player", text: "比如少掉的那株毛地黄？" },
    { speaker: "blake", text: "您观察得很快。可懂得植物的人不只有医生，伊芙琳小姐从小就在这里长大。", choices: [
      { text: "你在把怀疑引向伊芙琳。", response: "我只是提供医学事实。至于事实指向谁，那应当由您决定。", relation: -1 },
      { text: "爵士的药瓶里有什么？", response: "洋地黄制剂，正常剂量。若有人换了浓度，外表看不出任何区别。", relation: 1 }
    ] },
    { speaker: "blake", text: "您最好也问问霍尔。这个庄园里，没有哪把钥匙能真正避开他的眼睛。" }
  ],
  boathouse: [
    { speaker: "blake", text: "真巧。我们似乎总在不该相遇的地方相遇。" },
    { speaker: "player", text: "你的医疗箱为什么会在船屋？" },
    { speaker: "blake", text: "爵士下午在湖边胸闷，我或许把旧箱子忘在这里了。医生也会遗忘。", choices: [
      { text: "但箱上的泥来自温室。", response: "庄园的泥土到处都是。您若把巧合都叫作证据，会冤枉很多人。", relation: -2 },
      { text: "黄铜扣上刻着你的姓名缩写。", response: "那只能证明箱子属于我，不能证明昨夜拿着它的人也是我。", relation: 0 }
    ] },
    { speaker: "blake", text: "回到温暖的地方吧。冰面之下藏着什么，并不总值得知道。" }
  ],
  gate: [
    { speaker: "hall", text: "昨晚风雪太大，我让门房早些回家。九点以后，这里本该没有任何人。" },
    { speaker: "player", text: "出入簿显示大门没有开启，可布莱克医生说九点去过镇上。" },
    { speaker: "hall", text: "那不可能。铁门结冰时会发出很大的摩擦声，整座东翼都能听见。昨夜没有那种声音。", choices: [
      { text: "医生在伪造不在场证明。", response: "我不敢替您下结论。但他的汽车今早仍覆盖着完整的积雪。", relation: 2 },
      { text: "也可能有人改写了记录。", response: "可以改写墨水，却改不了雪。门外没有新鲜车辙。", relation: 1 }
    ] },
    { speaker: "hall", text: "如果您需要我作证，我会说出真话。即使这意味着维恩家的终结。" }
  ],
  chapel: [
    { speaker: "evelyn", text: "他们都觉得是我。叔父死后，遗产会归我——多么简单、体面的答案。" },
    { speaker: "player", text: "你说自己整晚都在祈祷，但那支蜡烛只燃烧了二十分钟。" },
    { speaker: "evelyn", text: "因为九点二十分，布莱克医生来找过我。他让我去书房劝叔父修改药量。", choices: [
      { text: "你见到爵士了吗？", response: "没有。书房门锁着，里面传出座钟上发条的声音。我以为叔父不愿见我。", relation: 2 },
      { text: "你为什么替医生隐瞒？", response: "他曾救过我的命。我欠他一次沉默——但不是一条人命。", relation: 1 }
    ] },
    { speaker: "evelyn", text: "这枚耳坠能证明我来过礼拜堂，却不能证明我整晚都在。现在，我把真实的时间交给你。" }
  ]
};

const freshState = () => ({
  actions: 5, evidence: new Set(), visited: new Set(), inspected: new Set(), talked: new Set(),
  relations: { evelyn: 0, hall: 0, blake: 0 }, selectedLocation: null, currentLocation: null,
  started: false, sound: false, voiceMode: "natural", voiceRate: .9, musicMode: "gothic"
});

let state = freshState();
let audio = null;
let voices = [];
let toastTimer;
let dialogueSession = null;
let typingTimer = null;
let typingFullText = "";
let typing = false;
let dialogueHistory = [];
let inspectorSession = null;
let inspectView = { scale: 1, x: 0, y: 0, rotation: 0, dragging: false, originX: 0, originY: 0 };

function serializeState() {
  return { ...state, evidence: [...state.evidence], visited: [...state.visited], inspected: [...state.inspected], talked: [...state.talked], currentLocation: null };
}

function restoreState(raw) {
  return { ...freshState(), ...raw, evidence: new Set(raw.evidence || []), visited: new Set(raw.visited || []), inspected: new Set(raw.inspected || []), talked: new Set(raw.talked || []) };
}

function saveGame() {
  if (!state.started) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(serializeState()));
}

function openPanel(id) {
  const panel = document.getElementById(id);
  panel.classList.add("is-open");
  panel.setAttribute("aria-hidden", "false");
  $("#game").classList.add("panel-open");
}

function closePanel(panel) {
  if (!panel) return;
  panel.classList.remove("is-open");
  panel.setAttribute("aria-hidden", "true");
  if (!$(".panel-overlay.is-open")) $("#game").classList.remove("panel-open");
}

function narrate(text, speaker = "调查手记") {
  $("#speaker").textContent = speaker;
  $("#narratorText").textContent = text;
}

function toast(text) {
  clearTimeout(toastTimer);
  const node = $("#toast");
  node.textContent = text;
  node.classList.add("show");
  toastTimer = setTimeout(() => node.classList.remove("show"), 2400);
}

function addEvidence(id) {
  if (!id || state.evidence.has(id)) {
    toast("这条线索已经收录");
    return false;
  }
  state.evidence.add(id);
  updateUI();
  renderEvidence();
  saveGame();
  toast(`新证据：${evidenceCatalog[id].title}`);
  narrate(evidenceCatalog[id].body, "新线索");
  return true;
}

function updateUI() {
  $("#actionPoints").textContent = state.actions;
  $("#clueCount").textContent = state.evidence.size;
  $("#evidenceBadge").textContent = state.evidence.size;
  const needed = Math.max(0, 5 - state.evidence.size);
  $("#deduceButton").disabled = needed > 0;
  $("#deduceHint").textContent = needed ? `还需找到 ${needed} 条关键线索` : "证据链已形成";
  $$(".map-pin").forEach(pin => pin.classList.toggle("visited", state.visited.has(pin.dataset.location)));
}

function renderEvidence() {
  const list = $("#evidenceList");
  list.innerHTML = "";
  if (!state.evidence.size) {
    list.innerHTML = "<p>尚未收录证据</p>";
    $("#evidenceDetail").innerHTML = '<span class="empty-mark">?</span><p>选择一条证据进行检视</p>';
    return;
  }
  state.evidence.forEach(id => {
    const button = document.createElement("button");
    button.textContent = evidenceCatalog[id].title;
    button.addEventListener("click", () => showEvidence(id, button));
    list.appendChild(button);
  });
}

function showEvidence(id, button) {
  $$("button", $("#evidenceList")).forEach(item => item.classList.remove("active"));
  button.classList.add("active");
  const item = evidenceCatalog[id];
  $("#evidenceDetail").innerHTML = `<span class="tag">${item.tag}</span><img class="evidence-preview" src="${item.image}" alt="${item.title}"><h3>${item.title}</h3><p>${item.body}</p><button class="inspect-again">放大检查物证</button>`;
  $(".inspect-again", $("#evidenceDetail")).addEventListener("click", () => openItemInspector(id));
}

function renderCharacters() {
  $("#characterGrid").innerHTML = Object.entries(characters).map(([id, item]) => `
    <section class="character-card">
      <img src="${item.image}" alt="${item.name}">
      <h3>${item.name}</h3><small>${item.role}</small><p>${item.note}</p>
      <small>信任度 ${state.relations[id] >= 0 ? "+" : ""}${state.relations[id]}</small>
    </section>`).join("");
}

function selectLocation(id, pin) {
  state.selectedLocation = id;
  $$(".map-pin").forEach(item => item.classList.remove("active"));
  pin.classList.add("active");
  const item = locations[id];
  const visited = state.visited.has(id);
  $("#locationCard").innerHTML = `
    <p class="eyebrow">${visited ? "已到访 · 可再次进入" : "新调查区域"}</p>
    <h3>${item.title}</h3><p>${item.description}</p>
    <button class="primary-button" id="enterLocation">${visited ? "再次进入" : "进入地区"}</button>`;
  $("#enterLocation").addEventListener("click", () => enterLocation(id));
}

function enterLocation(id) {
  const location = locations[id];
  state.currentLocation = id;
  state.visited.add(id);
  state.selectedLocation = id;
  closePanel($("#mapPanel"));
  $("#locationBackground").style.backgroundImage = `url("${location.background}")`;
  $("#locationTitle").textContent = location.title;
  $("#locationKicker").textContent = location.kicker;
  $("#sceneDescription").textContent = location.description;
  renderLocationHotspots(id);
  $("#locationScene").classList.add("is-open");
  $("#locationScene").setAttribute("aria-hidden", "false");
  $("#game").classList.add("location-active");
  updateUI();
  saveGame();
  if (!state.talked.has(id)) setTimeout(() => startDialogue(id), 850);
}

function renderLocationHotspots(locationId) {
  const location = locations[locationId];
  const root = $("#sceneHotspots");
  root.innerHTML = "";
  location.hotspots.forEach(spot => {
    const key = `${locationId}:${spot.id}`;
    const button = document.createElement("button");
    button.className = `scene-hotspot ${state.inspected.has(key) ? "inspected" : ""}`;
    button.style.left = `${spot.left}%`;
    button.style.top = `${spot.top}%`;
    button.innerHTML = `<i></i><span>${spot.label}</span>`;
    button.addEventListener("click", () => inspectSpot(locationId, spot, button));
    root.appendChild(button);
  });
  const talk = document.createElement("button");
  talk.className = "scene-hotspot talk";
  talk.style.left = `${location.talkAt.left}%`;
  talk.style.top = `${location.talkAt.top}%`;
  talk.innerHTML = `<i></i><span>与${characters[location.character].name}交谈</span>`;
  talk.addEventListener("click", () => startDialogue(locationId));
  root.appendChild(talk);
  const done = location.hotspots.filter(spot => state.inspected.has(`${locationId}:${spot.id}`)).length;
  $("#sceneProgress").textContent = `${done} / ${location.hotspots.length}`;
}

function inspectSpot(locationId, spot, button) {
  const key = `${locationId}:${spot.id}`;
  if (state.inspected.has(key)) {
    if (spot.type === "evidence") openItemInspector(spot.evidence);
    else {
      toast("已经检查过这里");
      narrate(spot.note, locations[locationId].title);
    }
    return;
  }
  if (spot.type === "evidence" && state.actions <= 0) {
    toast("行动力不足，先整理已有证据");
    return;
  }
  if (spot.type === "evidence") {
    openItemInspector(spot.evidence, () => {
      if (state.inspected.has(key)) return;
      state.inspected.add(key);
      state.actions -= 1;
      addEvidence(spot.evidence);
      narrate(spot.note, locations[locationId].title);
      renderLocationHotspots(locationId);
      updateUI();
      saveGame();
    });
  } else {
    state.inspected.add(key);
    button.classList.add("inspected");
    toast("调查记录已更新");
    narrate(spot.note, locations[locationId].title);
    renderLocationHotspots(locationId);
    updateUI();
    saveGame();
  }
}

function openItemInspector(evidenceId, onDiscover = null) {
  const item = evidenceCatalog[evidenceId];
  if (!item) return;
  inspectorSession = { evidenceId, onDiscover, discovered: state.evidence.has(evidenceId) };
  inspectView = { scale: 1, x: 0, y: 0, rotation: 0, dragging: false, originX: 0, originY: 0 };
  $("#inspectTag").textContent = item.tag;
  $("#inspectTitle").textContent = item.title;
  $("#inspectImage").src = item.image;
  $("#inspectImage").alt = item.title;
  $("#inspectDescription").textContent = item.body;
  $("#inspectDiscovery").textContent = inspectorSession.discovered ? item.discovery : "尚未发现决定性细节";
  $("#detailMarker").style.left = `${item.marker[0]}%`;
  $("#detailMarker").style.top = `${item.marker[1]}%`;
  $("#detailMarker").classList.toggle("found", inspectorSession.discovered);
  $("#itemInspector").classList.add("is-open");
  $("#itemInspector").setAttribute("aria-hidden", "false");
  applyInspectTransform();
}

function closeItemInspector() {
  $("#itemInspector").classList.remove("is-open");
  $("#itemInspector").setAttribute("aria-hidden", "true");
  inspectorSession = null;
}

function applyInspectTransform() {
  const object = $("#inspectObject");
  object.style.transform = `translate3d(${inspectView.x}px,${inspectView.y}px,0) scale(${inspectView.scale}) rotate(${inspectView.rotation}deg)`;
}

function changeInspectZoom(delta) {
  inspectView.scale = Math.min(3.2, Math.max(.72, inspectView.scale + delta));
  applyInspectTransform();
}

function resetInspectView() {
  inspectView = { scale: 1, x: 0, y: 0, rotation: 0, dragging: false, originX: 0, originY: 0 };
  applyInspectTransform();
}

function discoverItemDetail() {
  if (!inspectorSession) return;
  const item = evidenceCatalog[inspectorSession.evidenceId];
  $("#detailMarker").classList.add("found");
  $("#inspectDiscovery").textContent = item.discovery;
  if (!inspectorSession.discovered) {
    inspectorSession.discovered = true;
    inspectorSession.onDiscover?.();
    inspectorSession.onDiscover = null;
    toast("隐藏细节已记录");
  }
}

function leaveLocation(destination) {
  closeDialogue();
  if (destination === "hub") {
    $("#locationScene").classList.remove("is-open");
    $("#locationScene").setAttribute("aria-hidden", "true");
    $("#game").classList.remove("location-active");
    state.currentLocation = null;
    narrate("你回到临时调查室，桌上的档案等待被重新排列。", "调查手记");
  } else {
    openPanel("mapPanel");
  }
  saveGame();
}

function startDialogue(locationId) {
  const location = locations[locationId];
  state.talked.add(locationId);
  dialogueSession = { locationId, characterId: location.character, lines: JSON.parse(JSON.stringify(dialogues[location.dialogue])), index: 0 };
  dialogueHistory = [];
  const character = characters[location.character];
  $("#dialoguePortrait").src = character.image;
  $("#dialoguePortrait").alt = character.name;
  $("#characterStage").classList.toggle("right", location.character === "evelyn");
  $("#dialogueLayer").classList.add("is-open");
  $("#dialogueLayer").setAttribute("aria-hidden", "false");
  renderDialogueLine();
  saveGame();
}

function renderDialogueLine() {
  if (!dialogueSession) return;
  const line = dialogueSession.lines[dialogueSession.index];
  if (!line) {
    closeDialogue();
    return;
  }
  const speakerId = line.speaker;
  const character = speakerId === "player" ? { name: "调查员", role: "你的回答" } : characters[speakerId];
  $("#dialogueName").textContent = character.name;
  $("#dialogueRole").textContent = character.role;
  $("#dialogueChoices").innerHTML = "";
  $("#dialogueNext").hidden = !!line.choices;
  dialogueHistory.push({ name: character.name, text: line.text });
  renderDialogueHistory();
  typeDialogueText(line.text, () => {
    if (line.choices) renderChoices(line);
    else $("#dialogueNext").hidden = false;
  });
  if (speakerId !== "player") speakText(line.text, speakerId);
  else window.speechSynthesis?.cancel();
}

function typeDialogueText(text, onDone) {
  clearInterval(typingTimer);
  typingFullText = text;
  typing = true;
  const node = $("#dialogueText");
  node.textContent = "";
  let index = 0;
  typingTimer = setInterval(() => {
    index += 1;
    node.textContent = text.slice(0, index);
    if (index >= text.length) {
      clearInterval(typingTimer);
      typing = false;
      onDone?.();
    }
  }, 22);
}

function finishTyping() {
  if (!typing) return false;
  clearInterval(typingTimer);
  typing = false;
  $("#dialogueText").textContent = typingFullText;
  const line = dialogueSession.lines[dialogueSession.index];
  if (line.choices) renderChoices(line);
  else $("#dialogueNext").hidden = false;
  return true;
}

function renderChoices(line) {
  const root = $("#dialogueChoices");
  if (root.children.length) return;
  line.choices.forEach(choice => {
    const button = document.createElement("button");
    button.textContent = choice.text;
    button.addEventListener("click", () => chooseDialogue(choice));
    root.appendChild(button);
  });
}

function chooseDialogue(choice) {
  if (finishTyping()) return;
  dialogueHistory.push({ name: "调查员", text: choice.text });
  const characterId = dialogueSession.characterId;
  state.relations[characterId] += choice.relation || 0;
  const current = dialogueSession.lines[dialogueSession.index];
  current.choices = null;
  dialogueSession.lines.splice(dialogueSession.index + 1, 0, { speaker: characterId, text: choice.response });
  dialogueSession.index += 1;
  renderDialogueLine();
  renderCharacters();
  saveGame();
}

function advanceDialogue() {
  if (!dialogueSession) return;
  if (finishTyping()) return;
  const current = dialogueSession.lines[dialogueSession.index];
  if (current?.choices) return;
  dialogueSession.index += 1;
  renderDialogueLine();
}

function closeDialogue() {
  clearInterval(typingTimer);
  typing = false;
  window.speechSynthesis?.cancel();
  $("#characterStage").classList.remove("speaking");
  $("#dialogueLayer").classList.remove("is-open");
  $("#dialogueLayer").setAttribute("aria-hidden", "true");
  $("#dialogueLog").classList.remove("is-open");
  dialogueSession = null;
}

function renderDialogueHistory() {
  $("#dialogueLogContent").innerHTML = dialogueHistory.map(item => `<p><b>${item.name}</b>${item.text}</p>`).join("");
}

function loadVoices() {
  voices = window.speechSynthesis?.getVoices?.() || [];
}

function voiceScore(voice) {
  const label = `${voice.name} ${voice.voiceURI}`.toLowerCase();
  let score = /^zh-(cn|sg)/i.test(voice.lang) ? 80 : /^zh/i.test(voice.lang) ? 55 : 0;
  if (/natural|neural|enhanced|premium|xiaoxiao|yunxi|tingting|meijia|google.*普通话|mandarin/.test(label)) score += 55;
  if (voice.localService) score += 8;
  if (/cantonese|粤|hong kong|taiwan/.test(label)) score -= 25;
  return score;
}

function getBestVoice(characterId) {
  const ranked = [...voices].filter(voice => /^zh/i.test(voice.lang)).sort((a, b) => voiceScore(b) - voiceScore(a));
  if (!ranked.length) return null;
  const offset = characterId === "evelyn" ? 0 : characterId === "blake" ? 1 : 2;
  return ranked[Math.min(offset, ranked.length - 1)] || ranked[0];
}

function speakText(text, characterId) {
  if (!state.sound || state.voiceMode === "off" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const config = characters[characterId];
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.voice = getBestVoice(characterId);
  utterance.lang = "zh-CN";
  utterance.pitch = config.pitch;
  utterance.rate = Math.min(1.1, Math.max(.72, state.voiceRate * config.rate));
  utterance.volume = .82;
  utterance.onstart = () => $("#characterStage").classList.add("speaking");
  utterance.onend = () => $("#characterStage").classList.remove("speaking");
  utterance.onerror = () => $("#characterStage").classList.remove("speaking");
  window.speechSynthesis.speak(utterance);
}

function replayVoice() {
  if (!dialogueSession) return;
  const line = dialogueSession.lines[dialogueSession.index];
  if (line.speaker === "player") {
    toast("主角台词不配音");
    return;
  }
  speakText(line.text, line.speaker);
}

function syncAudioSettings() {
  $("#voiceMode").value = state.voiceMode;
  $("#voiceRate").value = state.voiceRate;
  $("#voiceRateValue").textContent = `${Number(state.voiceRate).toFixed(2)}×`;
  $("#musicMode").value = state.musicMode;
}

function createSnow() {
  const layer = $("#snow");
  for (let i = 0; i < 42; i++) {
    const flake = document.createElement("i");
    flake.className = "flake";
    flake.style.left = `${Math.random() * 100}%`;
    flake.style.animationDuration = `${5 + Math.random() * 9}s`;
    flake.style.animationDelay = `${-Math.random() * 10}s`;
    flake.style.opacity = .18 + Math.random() * .55;
    layer.appendChild(flake);
  }
}

function startAudio() {
  if (audio || !window.AudioContext && !window.webkitAudioContext) return;
  const context = new (window.AudioContext || window.webkitAudioContext)();
  const master = context.createGain();
  const ambientGain = context.createGain();
  const musicGain = context.createGain();
  master.gain.value = state.sound ? .9 : 0;
  ambientGain.gain.value = .42;
  musicGain.gain.value = state.musicMode === "gothic" ? .72 : 0;
  ambientGain.connect(master);
  musicGain.connect(master);
  master.connect(context.destination);

  const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
  const data = buffer.getChannelData(0);
  let last = 0;
  for (let i = 0; i < data.length; i++) {
    last = last * .985 + (Math.random() * 2 - 1) * .015;
    data[i] = last;
  }
  const source = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const windGain = context.createGain();
  source.buffer = buffer;
  source.loop = true;
  filter.type = "bandpass";
  filter.frequency.value = 240;
  filter.Q.value = .55;
  windGain.gain.value = .12;
  source.connect(filter).connect(windGain).connect(ambientGain);
  source.start();

  const droneFilter = context.createBiquadFilter();
  const droneGain = context.createGain();
  droneFilter.type = "lowpass";
  droneFilter.frequency.value = 190;
  droneGain.gain.value = .022;
  droneFilter.connect(droneGain).connect(musicGain);
  [73.42, 110].forEach((frequency, index) => {
    const oscillator = context.createOscillator();
    const voiceGain = context.createGain();
    oscillator.type = index ? "triangle" : "sine";
    oscillator.frequency.value = frequency;
    oscillator.detune.value = index ? -7 : 5;
    voiceGain.gain.value = index ? .45 : .7;
    oscillator.connect(voiceGain).connect(droneFilter);
    oscillator.start();
  });

  audio = { context, master, ambientGain, musicGain, nextNote: context.currentTime + .2, step: 0, timer: null };
  audio.timer = setInterval(scheduleGothicMusic, 120);
  scheduleGothicMusic();
}

function playGothicNote(frequency, when, bell = false) {
  if (!audio) return;
  const { context, musicGain } = audio;
  const oscillator = context.createOscillator();
  const overtone = context.createOscillator();
  const gain = context.createGain();
  const overtoneGain = context.createGain();
  oscillator.type = "sine";
  overtone.type = "sine";
  oscillator.frequency.value = frequency;
  overtone.frequency.value = frequency * (bell ? 2.76 : 2.01);
  gain.gain.setValueAtTime(.0001, when);
  gain.gain.exponentialRampToValueAtTime(bell ? .045 : .025, when + .012);
  gain.gain.exponentialRampToValueAtTime(.0001, when + (bell ? 4.2 : 2.1));
  overtoneGain.gain.value = bell ? .22 : .08;
  oscillator.connect(gain);
  overtone.connect(overtoneGain).connect(gain);
  gain.connect(musicGain);
  oscillator.start(when);
  overtone.start(when);
  oscillator.stop(when + (bell ? 4.3 : 2.2));
  overtone.stop(when + (bell ? 4.3 : 2.2));
}

function scheduleGothicMusic() {
  if (!audio) return;
  const melody = [293.66, 440, 349.23, 329.63, 293.66, 220, 261.63, 277.18, 293.66, 0, 220, 0, 261.63, 277.18, 220, 0];
  while (audio.nextNote < audio.context.currentTime + .45) {
    const note = melody[audio.step % melody.length];
    if (note && state.sound && state.musicMode === "gothic") playGothicNote(note, audio.nextNote, audio.step % 32 === 0);
    audio.nextNote += .74;
    audio.step += 1;
  }
}

function updateAudioMix() {
  if (!audio) return;
  const now = audio.context.currentTime;
  audio.master.gain.setTargetAtTime(state.sound ? .9 : 0, now, .12);
  audio.ambientGain.gain.setTargetAtTime(state.musicMode === "off" ? 0 : .42, now, .2);
  audio.musicGain.gain.setTargetAtTime(state.musicMode === "gothic" ? .72 : 0, now, .2);
}

function toggleSound() {
  if (!audio) startAudio();
  state.sound = !state.sound;
  audio?.context.resume?.();
  updateAudioMix();
  if (!state.sound) window.speechSynthesis?.cancel();
  $("#soundToggle").textContent = state.sound ? "◉" : "◐";
  $("#soundToggle").setAttribute("aria-label", state.sound ? "关闭声音" : "开启声音");
  saveGame();
}

function beginGame(restored = false) {
  if (!restored) {
    localStorage.removeItem(SAVE_KEY);
    state = freshState();
  }
  state.started = true;
  state.sound = true;
  $("#intro").classList.remove("is-open");
  $("#soundToggle").textContent = "◉";
  startAudio();
  audio?.context.resume?.();
  updateAudioMix();
  syncAudioSettings();
  updateUI();
  renderEvidence();
  renderCharacters();
  narrate(restored ? "你重新摊开调查笔记。所有未完成的线索仍在原处。" : "先检查桌面案卷，再从庄园模型选择第一个调查地点。", "调查手记");
  saveGame();
}

function resetGame() {
  closeDialogue();
  $$(".overlay.is-open").forEach(panel => panel.classList.remove("is-open"));
  $("#locationScene").classList.remove("is-open");
  $("#game").classList.remove("location-active", "panel-open");
  localStorage.removeItem(SAVE_KEY);
  state = freshState();
  beginGame(false);
}

$("#startButton").addEventListener("click", () => beginGame(false));
$("#continueButton").addEventListener("click", () => {
  const raw = JSON.parse(localStorage.getItem(SAVE_KEY));
  state = restoreState(raw);
  beginGame(true);
});

$$('[data-action]').forEach(button => button.addEventListener("click", () => {
  const action = button.dataset.action;
  if (action === "terminal") openPanel("terminalPanel");
  if (action === "files") openPanel("documentPanel");
  if (action === "map") openPanel("mapPanel");
  if (action === "phone") openPanel("phonePanel");
}));

$$('[data-close]').forEach(button => button.addEventListener("click", () => closePanel(button.closest(".overlay"))));

$$('[data-tab]').forEach(button => button.addEventListener("click", () => {
  $$('[data-tab]').forEach(tab => tab.classList.remove("active"));
  $$('[data-view]').forEach(view => view.classList.remove("active"));
  button.classList.add("active");
  $(`[data-view="${button.dataset.tab}"]`).classList.add("active");
  if (button.dataset.tab === "characters") renderCharacters();
}));

$$('[data-collect]').forEach(button => button.addEventListener("click", () => {
  const panel = button.closest(".overlay");
  closePanel(panel);
  openItemInspector(button.dataset.collect, () => addEvidence(button.dataset.collect));
}));

$$('.map-pin').forEach(pin => pin.addEventListener("click", () => selectLocation(pin.dataset.location, pin)));
$("#backToMap").addEventListener("click", () => leaveLocation("map"));
$("#backToHub").addEventListener("click", () => leaveLocation("hub"));
$("#dialogueClose").addEventListener("click", closeDialogue);
$("#dialogueNext").addEventListener("click", advanceDialogue);
$("#dialogueText").addEventListener("click", advanceDialogue);
$("#voiceReplay").addEventListener("click", replayVoice);
$("#dialogueLogButton").addEventListener("click", () => $("#dialogueLog").classList.toggle("is-open"));
$("#dialogueLogClose").addEventListener("click", () => $("#dialogueLog").classList.remove("is-open"));
$("#inspectClose").addEventListener("click", closeItemInspector);
$("#detailMarker").addEventListener("click", discoverItemDetail);
$("#inspectZoomIn").addEventListener("click", () => changeInspectZoom(.25));
$("#inspectZoomOut").addEventListener("click", () => changeInspectZoom(-.25));
$("#inspectRotate").addEventListener("click", () => {
  inspectView.rotation = (inspectView.rotation + 90) % 360;
  applyInspectTransform();
});
$("#inspectReset").addEventListener("click", resetInspectView);

$("#inspectImageWrap").addEventListener("wheel", event => {
  event.preventDefault();
  changeInspectZoom(event.deltaY < 0 ? .15 : -.15);
}, { passive: false });
$("#inspectImageWrap").addEventListener("pointerdown", event => {
  if (event.target.closest(".detail-marker")) return;
  inspectView.dragging = true;
  inspectView.originX = event.clientX - inspectView.x;
  inspectView.originY = event.clientY - inspectView.y;
  $("#inspectImageWrap").setPointerCapture?.(event.pointerId);
});
$("#inspectImageWrap").addEventListener("pointermove", event => {
  if (!inspectView.dragging) return;
  inspectView.x = event.clientX - inspectView.originX;
  inspectView.y = event.clientY - inspectView.originY;
  applyInspectTransform();
});
$("#inspectImageWrap").addEventListener("pointerup", () => inspectView.dragging = false);
$("#inspectImageWrap").addEventListener("pointercancel", () => inspectView.dragging = false);

function openAudioSettings() {
  syncAudioSettings();
  openPanel("audioSettingsPanel");
}
$("#audioSettingsButton").addEventListener("click", openAudioSettings);
$("#dialogueVoiceSettings").addEventListener("click", openAudioSettings);
$("#voiceMode").addEventListener("change", event => {
  state.voiceMode = event.target.value;
  if (state.voiceMode === "off") window.speechSynthesis?.cancel();
  saveGame();
});
$("#voiceRate").addEventListener("input", event => {
  state.voiceRate = Number(event.target.value);
  $("#voiceRateValue").textContent = `${state.voiceRate.toFixed(2)}×`;
  saveGame();
});
$("#musicMode").addEventListener("change", event => {
  state.musicMode = event.target.value;
  if (!audio) startAudio();
  audio?.context.resume?.();
  updateAudioMix();
  saveGame();
});
$("#voiceTestButton").addEventListener("click", () => speakText("暴雪会掩盖脚印，却掩盖不了被改动的时间。", "blake"));

$("#deduceButton").addEventListener("click", () => openPanel("deductionPanel"));
$$('[data-suspect]').forEach(button => button.addEventListener("click", () => {
  if (button.dataset.suspect === "blake") {
    closePanel($("#deductionPanel"));
    $("#ending").classList.add("is-open");
    $("#ending").setAttribute("aria-hidden", "false");
    localStorage.removeItem(SAVE_KEY);
    return;
  }
  if (state.actions > 0) state.actions -= 1;
  updateUI();
  saveGame();
  $("#logicLine").textContent = button.dataset.suspect === "evelyn"
    ? "她隐瞒了行踪，却无法解释医生的出入记录与毛地黄。"
    : "他知道所有门锁，却没有能力伪造专业的死亡时间。";
}));

$("#restartButton").addEventListener("click", resetGame);
$("#soundToggle").addEventListener("click", toggleSound);
$("#fullscreenToggle").addEventListener("click", () => {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
  else document.exitFullscreen?.();
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    if ($("#itemInspector.is-open")) closeItemInspector();
    else if ($("#dialogueLayer.is-open")) closeDialogue();
    else {
      const panel = $(".panel-overlay.is-open");
      if (panel) closePanel(panel);
    }
  }
  if ((event.key === " " || event.key === "Enter") && $("#dialogueLayer.is-open") && !$("#dialogueChoices button")) {
    event.preventDefault();
    advanceDialogue();
  }
});

document.addEventListener("pointermove", event => {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const x = (event.clientX / innerWidth - .5) * -1.4;
  const y = (event.clientY / innerHeight - .5) * -1.2;
  $("#roomImage").style.setProperty("--mx", `${x}%`);
  $("#roomImage").style.setProperty("--my", `${y}%`);
  if ($("#locationScene.is-open")) $("#locationBackground").style.transform = `scale(1.06) translate3d(${x * .25}%,${y * .25}%,0)`;
});

window.speechSynthesis?.addEventListener?.("voiceschanged", loadVoices);
loadVoices();
createSnow();
renderEvidence();
renderCharacters();
updateUI();
if (localStorage.getItem(SAVE_KEY)) $("#continueButton").hidden = false;
