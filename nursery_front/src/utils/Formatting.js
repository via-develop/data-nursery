export function NumberFormatting(number) {
  const formatter = Intl.NumberFormat("ko-KR");
  return formatter.format(number);
}

export function HourFormatting(second) {
  return parseInt(second / 3600);
}

export function MinFormatting(second) {
  if (second % 60 > 0) {
    return parseInt((second % 3600) / 60) + 1;
  } else {
    return parseInt((second % 3600) / 60);
  }
}

export function ImagePathCheck(imagePath) {
  const path = imagePath?.match(/^https?:\/\/[^/]*(\/[^?#]*)/i);

  if (path) {
    return imagePath;
  } else {
    return process.env.NEXT_PUBLIC_END_POINT + imagePath;
  }
}

export function DateFormatting(date) {
  // 날짜 옵션
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
    calendar: "korean",
  };

  if (!!date) {
    const changeDate = new Intl.DateTimeFormat("ko-KR", options).format(new Date(date)).replaceAll(".", "/").split(" ");
    return changeDate[0] + changeDate[1] + changeDate[2].replace("/", " ") + changeDate[3];
  }
}

export function DateKoreanFormatting(date) {
  // 날짜 옵션
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
    calendar: "korean",
  };

  if (!!date) {
    const changeDate = new Intl.DateTimeFormat("ko-KR", options).format(new Date(date)).split(".");
    return changeDate[0] + "년 " + changeDate[1] + "월 " + changeDate[2] + "일 " + changeDate[3];
  }
}

export function DateDotFormatting(date) {
  // 날짜 옵션
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
    timeZone: "Asia/Seoul",
    calendar: "korean",
  };

  if (!!date) {
    const changeDate = new Intl.DateTimeFormat("ko-KR", options).format(new Date(date)).split(" ");
    return changeDate[0] + changeDate[1] + changeDate[2].replace(".", " ") + changeDate[3];
  }
}

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
