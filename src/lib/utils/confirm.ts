import { mount, unmount } from "svelte";
import Promp from "$lib/components/Promp.svelte";

export async function confirm(question: string): Promise<boolean> {
  const { resolve, reject, promise } = Promise.withResolvers<boolean>();

  const instance = mount(Promp, {
    target: document.body,
    props: {
      message: question,
      onClose: () => resolve(false),
      onConfirm: () => resolve(true),
    },
  });

  const answer = await promise;

  unmount(instance);

  return answer;
}

export default confirm;
