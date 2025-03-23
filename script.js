// Валидатор номера телефона и инстанса: вся строка содержит только цифры
function isNumeric(phone) {
  return /^\d+$/.test(phone);
}

// Валидатор URL: должен начинаться с http:// или https:// и содержать допустимые символы
function isValidUrl(url) {
  return /^(https?:\/\/)[a-zA-Z0-9\-_\.\/]+$/.test(url);
}

// Получение idInstance, apiTokenInstance, URL и отправка запроса
async function apiRequest(endpoint, body, isGet = false) {
  const idInstance = document.getElementById("idInstance").value,
    apiToken = document.getElementById("apiTokenInstance").value;

  if (!idInstance || !apiToken) {
    document.getElementById("responseBox").innerText = "Ошибка: введите idInstance и apiToken";
    return;
  }

  if (!isNumeric(idInstance)) {
    document.getElementById("responseBox").innerText = "Ошибка: idInstance должен содержать только цифры.";
    return;
  }

  const urlPart = idInstance.slice(0, 4),
    url = `https://${urlPart}.api.green-api.com/waInstance${idInstance}/${endpoint}/${apiToken}`,
    options = {
      method: isGet ? "GET" : "POST",
      headers: { "Content-Type": "application/json" },
      ...(isGet ? {} : { body: JSON.stringify(body) })
    };

  try {
    const response = await fetch(url, options),
      data = await response.json();
    document.getElementById("responseBox").innerText = JSON.stringify(data, null, 2);
  } catch (error) {
    document.getElementById("responseBox").innerText = "Ошибка запроса: " + error.message;
  }
}

// Получение номера телефона и сообщения, передача в функцию отправки
function sendMessage() {
  const phone = document.getElementById("phoneNumber").value,
    message = document.getElementById("messageText").value;

 
  if (!phone || !message) {
    document.getElementById("responseBox").innerText = "Ошибка: заполните оба поля (номер телефона и сообщение)";
    return;
  }

  if (!isNumeric(phone)) {
    document.getElementById("responseBox").innerText = "Ошибка: номер телефона должен содержать только цифры.";
    return;
  }

  apiRequest("sendMessage", { chatId: phone + "@c.us", message });
}

// Получение номера телефона и ссылки на файл, передача в функцию отправки
function sendFileByUrl() {
  const phone = document.getElementById("filePhoneNumber").value,
    urlFile = document.getElementById("fileUrl").value;

  if (!isNumeric(phone)) {
    document.getElementById("responseBox").innerText = "Ошибка: номер телефона должен содержать только цифры.";
    return;
  }
 
  if (!phone || !urlFile) {
    document.getElementById("responseBox").innerText = "Ошибка: заполните оба поля (номер телефона и URL файла)";
    return;
  }

  const decodedUrl = decodeURI(urlFile);

  if (!isValidUrl(urlFile)) {
    document.getElementById("responseBox").innerText = "Ошибка: ссылка должна начинаться с http:// или https:// и не содержать недопустимых символов.";
    return;
  }

  apiRequest("sendFileByUrl", { chatId: phone + "@c.us", urlFile: decodedUrl, fileName: urlFile.split("/").pop() });
}