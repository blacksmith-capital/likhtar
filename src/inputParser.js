export default function(input) {
  return input.split(",").map(function(s) {
    let venue = s.split(':')[0]
    let symbol = s.split(':')[1]

    return {
      venue: venue,
      symbol: symbol
    }
  });
}
