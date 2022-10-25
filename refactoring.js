const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy'
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy'
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy'
  }
}

const invoices = [
  {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55
      },
      {
        'playID': 'as-like',
        'audience': 35
      },
      {
        'playID': 'Othello',
        'audience': 40
      }
    ]
  }
]

// statement 안의 switch 문을 함수형태로
function amountFor(aPerformance) { // perf 대신 aPerformance로 변경
  
  //let thisAmount = 0 --> 명확한 이름 result로 변경
  let result = 0

  switch (playFor(aPerformance).type) {
    case "tragedy":
      result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30)
      }
      break;
    case "comedy":
      result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20)
      }
      result += 300 * aPerformance.audience;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${playFor(aPerformance).type}`)
    }
}

//긴 함수를 쪼갤 때에는 임시 변수를 질의 함수로 바꿔는게 좋음
function playFor(aPerformance) {
  return plays[aPerformance.playID]
}

function volumeCreditsFor(aPerformance) {
  let result = 0
  result += Math.max(aPerformance.audience - 30, 0)

  if ("comedy" === playFor(aPerformance).type)
    result += Math.floor(aPerformance.audience / 5)
  return result
}

// format이라는 함수명 대신 좀 더 알아보기 쉬운 usd 라는 함수명으로 변경
function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber/100); // 단위 변환 로직도 함수 안으로 이동
}

// 최상위 함수
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 (고객:${invoice.customer}\n)`;
  // 함수로 추출 후 임시 변수 format 대신 함수 호출
  // const format = new Intl.NumberFormat("en-US", {
  //   style: "currency", currency: "USD",
  //   minimumFractionDigits: 2
  // }).format;

  for (let perf of invoice.performances) {
    //변수 인라인 적용
    // const play = playFor(perf);

    // switch 문을 함수형태로 바꾼 뒤 함수 call
    
    volumeCredits += volumeCreditsFor(perf)

    result += `${playFor(perf).name}: ${usd(amountFor(perf) / 100)}(${perf.audience}석\n)`
    totalAmount += amountFor(perf)
  }
  result += `총액: ${usd(totalAmount)}\n`
  result += `적립 포인트: ${volumeCredits}점\n`
  return result
}

statement(invoices,plays)