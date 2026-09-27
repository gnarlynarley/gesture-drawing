export async function confirm(question: string): Promise<boolean> {
  const answer = window.confirm(question);

  return answer;
}
