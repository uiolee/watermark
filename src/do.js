const mainInput = document.querySelectorAll("fieldset#mark-setting input");
const title = document.querySelector("nav ul li strong");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const actionBtn = document.querySelector("#action");
const image_upload = document.querySelector("#raw-img");
const nav_tip = document.querySelector("nav ul li small");

let maxSize;
let imgName;
let imgSize;
let imgType;

const inputCB = (checked = false) => {
  const start = Date.now();
  for (const x of mainInput) {
    const span = document.getElementById(x.id + "-span");
    if (span && span.innerHTML != x.value) {
      span.innerHTML = x.value;
    }
  }
  if (!checked) {
    return;
  }
  if (!document.getElementById("upload").files.length) {
    console.log("未选择文件");
    return;
  } else {
    actionBtn.disabled = false;
    actionBtn.setAttribute("aria-busy", true);
    const formatName = document.querySelector(
      "input[name='format'][checked]",
    ).id;

    const file = document.getElementById("upload").files[0];
    const upload = window.URL.createObjectURL(file);
    imgName = file.name;
    imgSize = file.size;
    imgType = file.type;
    image_upload.src = upload;
    image_upload.onload = () => {
      draw();
      can2jpg(canvas, formatName);
      showInfo(formatName);
      actionBtn.setAttribute("aria-busy", false);
      const cost = Date.now() - start;
      nav_tip.textContent = `${cost} ms`;
      console.info("finished", cost);
    };
  }
};

const showInfo = (formatName) => {
  const rInfo = document.querySelector("#raw-info");
  const pInfo = document.querySelector("#preview-info");
  rInfo.innerHTML = `type: ${imgType}<br>size: ${imgSize}`;
  pInfo.textContent = `type: ${formatName}`;
};

const draw = () => {
  canvas.width = image_upload.width;
  canvas.height = image_upload.height;
  maxSize = Math.max(image_upload.height, image_upload.width);
  canvas.style.height = (image_upload.height / image_upload.width) * 100 + "%";
  ctx.restore();
  ctx.drawImage(image_upload, 0, 0, canvas.width, canvas.height);
  ctx.fillStyle = document.getElementById("color").value;
  ctx.globalAlpha = document.getElementById("alpha").value / 100;
  const size = (document.getElementById("size").value * maxSize) / 100;
  ctx.font = size + 'px "' + document.getElementById("font").value + '"';
  ctx.textBaseline = "middle";
  const rot = document.getElementById("rotate").value;
  ctx.rotate((rot * Math.PI) / 180);
  const gap = (size * document.getElementById("gap").value) / 100;
  const content = document.getElementById("content").value;
  if (!content.length) return;
  const limit = Math.sqrt(2 * (maxSize * maxSize));
  const breaker = ctx.measureText(content).width;
  for (
    let h = -maxSize, even = false;
    h <= limit;
    h += size + gap, even = !even
  ) {
    for (
      let v = -maxSize - (even ? breaker / 2 : 0);
      v <= limit + (even ? breaker / 2 : 0);
      v += breaker + size
    ) {
      ctx.fillText(content, v, h);
    }
  }
};

const can2jpg = (canvas, formatName) => {
  canvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const previewImg = document.getElementById("preview-img");
      // const downloadBtn = document.getElementById("download");

      previewImg.src = url;
      previewImg.alt = imgName;
      previewImg.style = null;

      image_upload.style = null;

      // downloadBtn.disabled = false;
    },
    `image/${formatName}`,
    1,
  );
};

try {
  const live = document.querySelector("#live");
  document.querySelectorAll("input").forEach((input) => {
    input.onchange = function (ev) {
      inputCB(live.checked);
    };
  });

  actionBtn.addEventListener("click", () => {
    inputCB(true);
  });

  document.querySelectorAll("#mark-setting label").forEach((label) => {
    const input = label.querySelector("input");
    const node = document.createElement("span");
    node.textContent = input.value;
    node.id = input.id + "-span";
    label.insertBefore(node, input);
  });

  const checkedFix = () => {
    formatInput.forEach((elem) => {
      if (elem.checked) {
        elem.setAttribute("checked", true);
      } else {
        elem.removeAttribute("checked");
      }
    });
  };
  const formatInput = document.querySelectorAll("input[name='format']");
  formatInput.forEach((elem) => {
    elem.addEventListener("click", checkedFix);
  });

  // document.querySelector("#download").addEventListener("click", () => {
  //   const img = document.getElementById("preview-img");
  //   const aNode = document.createElement("a");
  //   aNode.href = img.href;
  //   aNode.alt = imgName;
  //   aNode.download = document.title + " - " + imgName;
  //   aNode.click();
  // });

  title.textContent = document.title;
  title.addEventListener("click", () => {
    window.location.replace("");
  });
} catch (err) {
  title.textContent = "加载失败，请重试";
  console.error(err);
} finally {
  title.setAttribute("aria-busy", false);
}
