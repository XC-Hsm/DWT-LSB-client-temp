// 获取相关元素
const audio = document.getElementById('audio')
const methodSelect = document.getElementById('algorithm');
const mediaTypeSelect = document.getElementById('mediaType');
const imageInputDiv = document.getElementById('imageInput');
const textInputDiv = document.getElementById('textInput');
const uploadBtn = document.getElementById('upload-btn');
const textInput = document.getElementById('textToHide')
const imageInput = document.getElementById('imageToHide')

const watermarkAudio = document.getElementById('audio2');
const srcAudio = document.getElementById('audio3');
const keyInput = document.getElementById('key');
const submitBtn = document.getElementById('submit-btn');
// 根据选择的媒体类型显示对应的选项
mediaTypeSelect.addEventListener('change', function () {
  if (this.value.toLowerCase() === '0') {
    imageInputDiv.style.display = 'none';
    textInputDiv.style.display = 'inline-block';
  } else {
    imageInputDiv.style.display = 'inline-block';
    textInputDiv.style.display = 'none';
  }
});
// 点击上传按钮时触发
uploadBtn.addEventListener('click', function () {
  var audioFile = audio.files[0]
  var method = methodSelect.value;
  var mediaType = mediaTypeSelect.value;
  var text = textInput.value;
  var imageFile = imageInput.files[0]
  // 检查音频文件

  if (!audioFile || (audioFile && !audioFile.type.includes('audio/'))) {
    alert('请选择一个音频文件');
    return;
  }

  // 检查文本内容
  if (mediaType == '0' && text.trim().length == 0) {
    alert('请输入文本内容');
    return;
  }

  // 检查图片文件
  if (mediaType == '1' && (!imageFile || (imageFile && !imageFile.type.includes('image/')))) {
    alert('请选择一个图片文件');
    return;
  }
  const formData = new FormData();
  formData.append('audio', audioFile)
  formData.append('algorithm', method)
  formData.append('type', mediaType)
  if (mediaType == '0') {
    // 文本
    formData.append('text', text)
  } else {
    formData.append('image', imageFile)
  }
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:5000/test', true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (xhr.status === 200) {
      var customData = xhr.getResponseHeader('Key');
      console.log("Key", customData);

      var blob = xhr.response;
      var url = URL.createObjectURL(blob);

      var a = document.createElement('a');
      a.href = url;
      a.download = 'audio.mp3';
      document.body.appendChild(a);
    }
  };
  xhr.send(formData);
});



// 点击上传按钮时触发
submitBtn.addEventListener('click', function () {
  var audioFile = watermarkAudio.files[0]
  var srcaudioFile=srcAudio.files[0]
  var key = keyInput.value;
  if (!audioFile || (audioFile && !audioFile.type.includes('audio/'))) {
    alert('请选择一个音频文件');
    return;
  }
  if (key.trim().length == 0) {
    alert('请输入文本内容');
    return;
  }

  const formData = new FormData();
  formData.append('audio', audioFile)
  formData.append('srcaudio',srcaudioFile)
  formData.append('key', key)
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:5000/test2', true);
  xhr.responseType = 'blob';
  xhr.onload = function () {
    if (xhr.status === 200) {
      const contentType = xhr.getResponseHeader('Content-Type');
      if (contentType.includes('text')) {
        const responseText = xhr.responseText;
        // 处理文本响应
        console.log('Text response:', responseText);
      } else if (contentType.includes('image')) {
        const blob = xhr.response;
        const imageUrl = URL.createObjectURL(blob);
        // 处理图片响应
        console.log('Image response:', imageUrl);
      }
    }
  };
  xhr.send(formData);
});

