import { ToastAndroid } from "react-native";
import * as STORAGE from "../Storage";
import api from "./api";

const toastError = () => {
  ToastAndroid.showWithGravityAndOffset(
    "Terjadi Kesalahan, tidak dapat mengambil data",
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50
  );
};

export function searchArtist(query, onReceived, onError) {
  api
    .get("band", { params: { string: query } })
    .then((res) => onReceived(res.data.row))
    .catch(() => {
      onError();
      toastError();
    });
}

export function searchLagu(query, onReceived, onError) {
  api
    .get("cari", { params: { string: query } })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export const getPopular = () => api.get("populer");
export const getTerbaru = () => api.get("terbaru");

export function loadMore(query, currentPage, onReceived, onError) {
  api
    .get("cari", { params: { string: query, page: currentPage + 1 } })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function getSongsByArtist(id, currentPage, onReceived, onError) {
  api
    .get("lagu", {
      params: {
        band: id,
        page: currentPage,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function loadMoreByArtist(id, currentPage, onReceived, onError) {
  api
    .get("lagu", {
      params: {
        band: id,
        page: currentPage + 1,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function getSongContent(songPath, onReceived, onError) {
  api
    .get("chord/" + songPath)
    .then((res) => onReceived(res.data))
    .catch(() => onError());
}

export function getTerkait(songPath, onReceived, onError) {
  api
    .get("terkait/" + songPath)
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

function getQueryString(data = {}) {
  return Object.entries(data)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
}

export function postSong(data, onSuccess, onError) {
  const song = {
    judul: data.title,
    nama_band: data.artist,
    chord: data.content,
    abjad: data.abjad,
    created_by: data.created_by,
  };
  const headers = {
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  api.post("post", getQueryString(song), { headers }).then((res) => {
    if (res.data.error) {
      toastError(res.data.msg);
      onError();
    } else {
      onSuccess(res.data);
    }
  });
}

export function getMyChords(user_id, onReceived, onError) {
  api
    .get("created", {
      params: {
        user_id: user_id,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function loadMoreMyChords(user_id, currentPage, onReceived, onError) {
  api
    .get("created", {
      params: {
        user_id: user_id,
        page: currentPage + 1,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function deleteChord(id, onSuccess, onError) {
  const song = {
    id: id,
  };
  const headers = {
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  api
    .delete("destroy", {
      data: getQueryString(song),
      headers: headers,
    })
    .then((res) => {
      if (res.data.error) {
        ToastAndroid.showWithGravityAndOffset(
          res.data.msg,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        onError();
      } else {
        onSuccess(res.data);
      }
    })
    .catch((e) => {
      console.log(e);
      onError();
    });
}

export function updateChord(data, onSuccess, onError) {
  const song = {
    id: data.id,
    nama_band: data.nama_band,
    chord: data.chord,
    judul: data.judul,
    abjad: data.abjad,
  };
  const headers = {
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  api
    .put("update", getQueryString(song), { headers })
    .then(() => onSuccess())
    .catch(() => {
      onError();
      toastError();
    });
}

export function like(data, onSuccess, onError) {
  const prop = {
    id_chord: data.id_chord,
    id_user: data.id_user,
  };
  const headers = {
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  api.post("sukai", getQueryString(prop), { headers }).then(
    (res) => {
      if (res.data.error) {
        ToastAndroid.showWithGravityAndOffset(
          res.data.msg,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
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

export function unLike(data, onSuccess, onError) {
  const prop = {
    id_chord: data.id_chord,
    id_user: data.id_user,
  };
  const headers = {
    apa: "79fa2fcaecf5c83c299cd96e2ba44710",
    "Content-Type": "application/x-www-form-urlencoded",
  };
  api.post("batalsuka", getQueryString(prop), { headers }).then(
    (res) => {
      if (res.data.error) {
        ToastAndroid.showWithGravityAndOffset(
          res.data.msg,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
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

export function getMyLikes(user_id, onReceived, onError) {
  api
    .get("disukai", {
      params: {
        id_user: user_id,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function loadMoreMyLikes(user_id, currentPage, onReceived, onError) {
  api
    .get("disukai", {
      params: {
        id_user: user_id,
        page: currentPage + 1,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function getAllMyLikes(user_id, onReceived, onError) {
  api
    .get("allLikes", {
      params: {
        id_user: user_id,
      },
    })
    .then((res) => onReceived(res.data))
    .catch(() => {
      onError();
      toastError();
    });
}

export function syncLocalAndApiLikes(user_id, onSuccess, onError) {
  let local = [];
  let server = [];
  STORAGE.getSavedList((data) => {
    data &&
      data.forEach((item) => {
        local.push(item.id);
      });

    api
      .get("allLikes", {
        params: {
          id_user: user_id,
        },
      })
      .then(
        (res) => {
          res.data.forEach((item) => {
            server.push(item.id);
          });

          let b = new Set(local);
          let difference = [...server].filter((x) => !b.has(x));
          console.log("diff " + difference);
          difference.forEach((item) => {
            getSongContent(
              item,
              (data) => {
                STORAGE.saveSong(data, () => console.log(item + " saved"));
              },
              () => console.log(item + " failed to save")
            );
          });
          onSuccess();
        },
        () => {
          onError();
          toastError();
        }
      );
  });
}
