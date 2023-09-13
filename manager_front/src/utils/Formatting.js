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
  return date.toLocaleDateString(undefined, options).replace(/. /g, "/").slice(0, 10);
}

//날짜 0000-00-00 형식으로
export function YYYYMMDDDash(dateString) {
  const options = { year: "numeric", month: "2-digit", day: "2-digit" };
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, options).replace(/. /g, "-").slice(0, 10);
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
