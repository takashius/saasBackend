import {
  getPost as _getPost,
  getSimple,
  getPaginate,
  addPost as _addPost,
  updatePost as _updatePost,
  deletePost as _deletePost,
} from "./store";

export async function getPost(postId: string) {
  try {
    const result = await _getPost(postId);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function getPosts(filter: string, page: number, simple: boolean) {
  try {
    if (!page || page < 1) {
      page = 1;
    }
    if (filter === "" || filter === undefined || !filter) {
      filter = null;
    }
    let newArray = [];
    let result = null;
    if (simple) {
      result = await getSimple();
      result.message.map((item: any) => {
        newArray.push({
          id: item._id,
          name: item.title,
        });
      });
    } else {
      result = await getPaginate(filter, page);
    }
    return {
      status: result.status,
      message: simple ? newArray : result.message,
    };
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected error",
      detail: e,
    };
  }
}

export async function addPost(post: any, file: any, user: any) {
  try {
    return await _addPost(post, file, user);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updatePost(post: any, file: any) {
  try {
    if (!post._id) {
      return {
        status: 400,
        message: "No post ID received",
      };
    }
    const result = await _updatePost(post, file);
    return result;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function deletePost(id: string) {
  try {
    return await _deletePost(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
