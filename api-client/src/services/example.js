export function getExampleResponse() {
  return fetch('http://localhost:3001/example')
    .then(response => response.json())
    .then(data => data);
}
