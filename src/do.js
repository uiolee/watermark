const input = document.getElementsByTagName("input");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const image_upload = new Image();

let maxSize;
let imgName;
let upload;

for (let i = 0; i < input.length; i++) {
  (function (i) {
    // let id = input[i].id;
    input[i].onchange = function (ev) {
      loadImage();
    };
  })(i);
  if (2 <= i && i <= 6) {
    let label = document.getElementsByTagName("label");
    let node = document.createElement("span");
    node.innerHTML = input[i].value;
    node.id = input[i].id + "-span";
    label[i].appendChild(node);
  }
}

function loadImage() {
  for (const x of input) {
    if (document.getElementById(x.id + "-span")) {
      document.getElementById(x.id + "-span").innerHTML = x.value;
    }
  }
  if (!document.getElementById("upload").files.length) {
    return;
  } else {
    upload = window.URL.createObjectURL(
      document.getElementById("upload").files[0],
    );
    imgName = document.getElementById("upload").files[0].name;
    image_upload.src = upload;
    image_upload.onload = function () {
      canvas.width = image_upload.width;
      canvas.height = image_upload.height;
      maxSize = Math.max(image_upload.height, image_upload.width);
      canvas.style.height =
        (image_upload.height / image_upload.width) * 100 + "%";
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
      can2jpg(canvas);
    };
  }
}

function can2jpg(canvas) {
  canvas.toBlob(
    (blob) => {
      const url = URL.createObjectURL(blob);
      const previewImg = document.getElementById("preview-img");
      const downloadBtn = document.getElementById("download");
      previewImg.src = url;
      previewImg.alt = imgName;
      previewImg.style = null;
      downloadBtn.href = url;
      downloadBtn.alt = imgName;
      downloadBtn.download = document.title + " - " + imgName;
    },
    "image/jpeg",
    1,
  );
}
