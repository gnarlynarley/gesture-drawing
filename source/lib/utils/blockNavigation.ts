export default function blockNavigation(message: string | boolean) {
  if (message !== false) {
    window.onbeforeunload = () => {
      return "";
    };
  } else {
    window.onbeforeunload = () => {};
  }
}
