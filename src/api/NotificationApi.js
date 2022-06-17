import axios from "axios";

export async function sendNotificationRequestToAdmin(
  message,
  onSuccess,
  onError
) {
  const params = JSON.stringify({
    to: "/topics/admin",
    notification: {
      title: "Request Chord",
      body: message,
    },
  });

  const headers = {
    Authorization:
      "key=AAAAGw2ZOBs:APA91bEN1n45o3454SR-rxHOUgVoM8FDK3FJk9byPO92eJkvc0hdlZsX9NWwMP2RTG_9zvtitJRXUUrO8LV1EBTJjLYv1R8Q-OGl__t2Tp0u4VMvOMddpjqd1cUzVM7NaQ2twlyZgF1C",
    "Content-Type": "application/json",
  };
  await axios
    .post("https://fcm.googleapis.com/fcm/send", params, { headers })
    .then(
      (res) => {
        if (res.data.error) {
          onError();
        } else {
          onSuccess(res.data);
        }
      },
      () => {
        onError();
      }
    );
}
