// 금액 , 찍기
export function NumberCommaFormatting(number) {
  const formatter = Intl.NumberFormat("ko-KR");
  return formatter.format(number);
}

// 단위
export function NumberUnitFormatting(number) {
  let format_number = number;

  // 100이상 1.00M
  if (number >= 1000000) {
    format_number = Math.floor(number * 0.000001 * 100) / 100;

    return format_number + "M";
  }
  // 1000이상 1.00K
  else if (number >= 1000) {
    format_number = Math.floor(number * 0.001 * 100) / 100;

    return format_number + "K";
  } else {
    return number;
  }
}

//99999 넘으면 +표시 , 3자리수마다 comma 표시
export function CountPlusFormatting(number) {
  if (number > 99999) {
    return "99,999+";
  } else if (number <= 99999) {
    const formatter = Intl.NumberFormat("ko-KR");
    return formatter.format(number);
  }
}

//날짜 0000/00/00 형식으로
export function YYYYMMDDSlash(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", options).replace(/. /g, "/").slice(0, 10);
}

//날짜 0000-00-00 형식으로
export function YYYYMMDDDash(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", options).replace(/. /g, "-").slice(0, 10);
}

// 통계현황 연도목록
export function GetYearList() {
  const result = [];
  const lastYear = new Date().getFullYear();

  if (2023 === lastYear) {
    result.push(2023);
  } else {
    for (let i = lastYear; 2023 <= i; i--) {
      result.push(i);
    }
  }

  return result.reverse();
}

// 통계현황 월목록
export function GetMonthList(selectYear) {
  const result = [];

  const lastYear = new Date().getFullYear();
  const lastMonth = new Date().getMonth() + 1;

  if (2023 === selectYear) {
    for (let i = 9; i <= lastMonth; i++) {
      result.push(i);
    }
  } else if (2023 < selectYear && selectYear < lastYear) {
    for (let i = 1; i <= 12; i++) {
      result.push(i);
    }
  } else {
    for (let i = 1; i <= lastMonth; i++) {
      result.push(i);
    }
  }

  return result;
}

export function ImagePathCheck(imagePath) {
  const path = imagePath?.match(/^https?:\/\/[^/]*(\/[^?#]*)/i);

  if (path) {
    return imagePath;
  } else {
    return process.env.NEXT_PUBLIC_END_POINT + imagePath;
  }
}

// 개요 : 파종기 가동시간 시간 사용
export function OperationTime(seconds) {
  if (seconds < 60) {
    // 1분 미만
    return "0m";
  }
  if (seconds < 3600) {
    // 1시간 미만
    let minutes = seconds / 60;
    return Math.floor(minutes) + "m";
  }
  if (seconds >= 3600) {
    // 1시간 이상
    let hours = seconds / 3600;
    return Math.floor(hours) + "h";
  }
}
// 개요 : 파종기 가동시간 시간 도넛그래프 사용
export function OperationTimeGraph(seconds) {
  if (seconds < 1) {
    return 0;
  } else if (seconds > 0 && seconds < 3600) {
    // 1시간 미만 : 1시간 그래프를 표현
    return (seconds = 3600);
  } else if (seconds >= 3600) {
    // 1시간 이상
    return seconds;
  }
}
