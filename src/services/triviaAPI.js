export default function triviaAPI() {
  const endpoint = 'https://opentdb.com/api_token.php?command=request';
  return fetch(endpoint)
    .then((resp) => resp.json())
    .then((result) => result.token);
}
