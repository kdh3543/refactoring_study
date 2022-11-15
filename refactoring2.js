// 중첩함수 제거

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

const invoice = [
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

function amountFor(aPerformance) { 
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

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency", currency: "USD",
    minimumFractionDigits: 2
  }).format(aNumber/100); 
}

function totalVolumeCredit() {
  let result = 0; 
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf)
  }
  return result;
}

function totalAmount() {
  let result = 0;

  for (let perf of invoice.performances) {
 
    result += amountFor(perf)
  }
  return result;
}

// 최상위 함수
function statement(invoice, plays) {
  
  let result = `청구 (고객:${invoice.customer}\n)`;

  result += `총액: ${usd(totalAmount())}\n`
  result += `적립 포인트: ${totalVolumeCredit()}점\n`
  return result
}
