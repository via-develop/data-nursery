// 웹 워커 스크립트 (worker.js)

function updateClock() {
  const now = new Date();
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const Dotdate = now.toLocaleDateString("ko-KR", options); //0000.00.00. 형식
  const date = Dotdate.slice(0, -1); //0000.00.00 형식
  const hours = now.getHours();
  const minutes = now.getMinutes();

  const formattedHours = hours.toString().padStart(2, "0"); // 00 to 24
  const formattedMinutes = minutes.toString().padStart(2, "0"); // 00 to 59

  // 24시간제
  return `${date} ${formattedHours}:${formattedMinutes}`;
}

function tick() {
  postMessage(updateClock());
  setTimeout(tick, 1000);
}

tick();
