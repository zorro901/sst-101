export default function Home() {
  return <p className={"text-white"}>test</p>;
  // const session = await getServerSession(authOptions);
  // const caller = await createTRPCCaller(session);
  // const hello = await caller.example.hello({
  //   text: "Trpc from server component",
  // });
  // const secretMessage = session
  //   ? await caller.example.getSecretMessage()
  //   : undefined;
  //
  // return (
  //   <HomePage
  //     hello={hello}
  //     secretMessage={secretMessage}
  //     serverSession={session}
  //   />
  // );
}
