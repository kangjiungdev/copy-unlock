document.oncontextmenu = null;
document.onselectstart = null;
document.oncopy = null;
document.oncut = null;
document.onmousedown = null;
document.body.oncontextmenu = null;
document.body.onselectstart = null;
document.body.oncopy = null;
document.body.oncut = null;
document.body.onmousedown = null;

["contextmenu", "selectstart", "copy", "cut", "mousedown", "keydown"].forEach(
  (event) => {
    window.addEventListener(
      event,
      function (e) {
        e.stopImmediatePropagation();
      },
      true
    );
  }
);

document.querySelectorAll("iframe").forEach((iframe) => {
  try {
    const win = iframe.contentWindow;
    if (win) {
      win.document.oncontextmenu = null;
      win.document.onselectstart = null;
      win.document.oncopy = null;
      win.document.oncut = null;

      win.document.querySelectorAll("*").forEach((el) => {
        el.style.userSelect = "text";
        el.style.webkitUserSelect = "text";
        el.style.msUserSelect = "text";
      });

      ["contextmenu", "selectstart", "copy", "cut", "mousedown"].forEach(
        (event) => {
          win.addEventListener(
            event,
            function (e) {
              e.stopImmediatePropagation();
            },
            true
          );
        }
      );
    }
  } catch (e) {}
});

(async () => {
  const delElement = await returnElementHasID(
    "copy-unlock-style-id",
    "styleID"
  );
  if (delElement) {
    delElement.remove();
  }
  const style = document.createElement("style");
  setStorageElementID(style, "copy-unlock-style-id", "styleID");
  style.innerHTML = `
* {
    -webkit-user-select: text !important;
    -moz-user-select: text !important;
    -ms-user-select: text !important;
    user-select: text !important;
}`;
  document.head.appendChild(style);
  showCopyUnlockAlertMsg();
})();

async function showCopyUnlockAlertMsg() {
  const delElement = await returnElementHasID("alert-msg-id", "alertMsg");
  if (delElement) {
    delElement.remove();
  }

  const alertMsg = document.createElement("div");
  setStorageElementID(alertMsg, "alert-msg-id", "alertMsg");
  alertMsg.innerText = "복사 방지 해제됨";

  Object.assign(alertMsg.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    background: "#3C3C3C",
    color: "#ecf0f1",
    padding: "12px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
    fontSize: "14px",
    fontWeight: "500",
    zIndex: "99999",
    animation: "fadeInOut 1.3s ease forwards",
    pointerEvents: "none",
  });

  document.body.appendChild(alertMsg);

  if (
    !(await returnElementHasID("alert-msg-animation-style-id", "animeStyle"))
  ) {
    const animeStyle = document.createElement("style");
    setStorageElementID(
      animeStyle,
      "alert-msg-animation-style-id",
      "animeStyle"
    );
    animeStyle.textContent = `
      @keyframes fadeInOut {
        0%   { opacity: 0; transform: translateY(-10px); }
        15%  { opacity: 1; transform: translateY(0); }
        80%  { opacity: 1; }
        100% { opacity: 0; transform: translateY(-10px); }
      }
    `;
    document.head.appendChild(animeStyle);
  }

  setTimeout(() => {
    alertMsg.remove();
  }, 1300);
}

/** element, id(값), keyName을 받아서 element.id를 id(값)-uuid로 설정하고 크롬 스토리지에 keyName 키 값으로 uuid를 저장 */
function setStorageElementID(element, id, keyName) {
  const uuid = generateUUIDv4();
  element.id = `${id}-${uuid}`;
  chrome.storage.local.set({ [keyName]: uuid });
}

/** id(값), keyName 받아서 'id(값)-{keyName에 저장된 벨류}'라는 id를를 가진 element 반환 */
function returnElementHasID(id, keyName) {
  return new Promise((resolve) => {
    chrome.storage.local.get(keyName, (result) => {
      const element = document.getElementById(`${id}-${result[keyName]}`);
      resolve(element);
    });
  });
}

function generateUUIDv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
