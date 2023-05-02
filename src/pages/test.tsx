import { trpc } from '@/utils/trpc';

const Test = () => {
  const hello = trpc.hello.useQuery({ text: 'client' });
  return (
    <div>
      <h1>Test</h1>
      <p>{hello.data?.greeting}</p>
    </div>
  );
};
export default Test;
