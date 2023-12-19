// // 웹 워커 스크립트 (worker.js)

// // 현재 시간을 한국 시간으로 변환하는 함수
// function getKoreanTime() {

//   const now = new Date();

//   let year = now.getFullYear();
//   let month = (now.getMonth() + 1).toString().padStart(2, '0'); // 월은 0부터 시작하므로 +1 해줌
//   let day = now.getDate().toString().padStart(2, '0');
//   let hours = now.getHours().toString().padStart(2, '0');
//   let minutes = now.getMinutes().toString().padStart(2, '0');

//   const date = `${year}.${month}.${day}`;
//   const time = `${hours}:${minutes}`;

//   return { date, time };
// }

// // 메인 스레드로 데이터를 전송
// function postKoreanTime() {
//   const koreanTime = getKoreanTime();
//   self.postMessage(koreanTime);

//   // 1초마다 시간 업데이트하여 메인 스레드로 전송
// setInterval(postKoreanTime, 1000);

// }

// // 웹 워커가 처음 실행될 때 업데이트 시작
// postKoreanTime();

function getCurrentDateTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${year}. ${month}. ${day} ${hours}:${minutes}`;
}

setInterval(() => {
  const currentDateTime = getCurrentDateTime();
  postMessage(currentDateTime);
}, 1000);