export async function generateStaticParams() {
  return [{ id: "1" }, { id: "2" }, { id: "3" }];
}

export default async function UserPage({ params }) {
  // `params`는 동기적으로 제공되므로 별도의 `await`가 필요하지 않습니다.
  const { id } = await params;

  return (
    <div>
      <h1>사용자 프로필</h1>
      <p>사용자 ID: {id}</p>
    </div>
  );
}
