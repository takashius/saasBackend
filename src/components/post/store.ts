import Posts from "./model";
import moment from "moment";
import { PostResponse } from "../../types/post";
import { StoreResponse } from "../../types/general";
import { removeImage } from "../../middleware/saveFile";

export async function getPost(id: string) {
  try {
    let query: any = { active: true };
    if (id) {
      query = { _id: id };
    }

    const result = await Posts.findOne(query);
    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getPost", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getSimple() {
  try {
    let query: any = { active: true };
    let select = "id title";

    const result = await Posts.find(query).select(select).sort({ name: "asc" });

    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getSimple", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getPaginate(
  filter: string,
  page: number
): Promise<StoreResponse> {
  try {
    const limit = 10;
    let query: any = { active: true };
    let select = "";
    if (filter) {
      query.$or = [
        { title: { $regex: filter, $options: "i" } },
        { resume: { $regex: filter, $options: "i" } },
        { content: { $regex: filter, $options: "i" } },
      ];
    }
    select = "id title resume content image createdAt updatedAt";

    const result = await Posts.find(query)
      .select(select)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({
        name: "asc",
      });
    const formattedResult = result.map((post) => {
      const plainPost = post.toObject();
      return {
        ...plainPost,
        createdAt: moment(post.createdAt).format("DD/MM/YYYY HH:mm"),
        updatedAt: moment(post.updatedAt).format("DD/MM/YYYY HH:mm"),
      };
    });

    const totalPosts = await Posts.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);
    const next = () => {
      if (totalPages > page) {
        return page + 1;
      } else {
        return null;
      }
    };

    return {
      status: 200,
      message: {
        results: formattedResult,
        totalPosts,
        totalPages,
        currentPage: page,
        next: next(),
      },
    };
  } catch (e) {
    console.log("[ERROR] -> getPaginate", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function addPost(
  post: PostResponse,
  file: any,
  user: any
): Promise<StoreResponse> {
  try {
    const data = new Posts({
      title: post.title,
      resume: post.resume,
      content: post.content,
      image: file?.path ? file.path : "",
      user,
    });
    await data.save();
    return { status: 201, message: dataFormatted(data) };
  } catch (e) {
    return {
      status: 500,
      message: "Post registration error",
      detail: e,
    };
  }
}

export async function updatePost(
  post: PostResponse,
  file: any
): Promise<StoreResponse> {
  try {
    const foundPost = await Posts.findOne({ _id: post._id });
    if (!foundPost) {
      throw new Error("No post found");
    }
    if (post.title) {
      foundPost.title = post.title;
    }
    if (post.resume) {
      foundPost.resume = post.resume;
    }
    if (post.content) {
      foundPost.content = post.content;
    }
    if (file) {
      if (foundPost.image) {
        removeImage(foundPost.image);
      }
      foundPost.image = file.path;
    }

    await foundPost.save();
    return { status: 200, message: dataFormatted(foundPost) };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function deletePost(id: string): Promise<StoreResponse> {
  try {
    const foundPost = await Posts.findOne({
      _id: id,
    });
    if (!foundPost) {
      throw new Error("No Post found");
    }
    foundPost.active = false;
    foundPost.save();

    return { status: 200, message: "Post deleted" };
  } catch (e) {
    console.log("[ERROR] -> deletePost", e);
    return {
      status: 400,
      message: "An error occurred while deleting the post",
      detail: e,
    };
  }
}

const dataFormatted = (data: any) => {
  const formattedCreatedAt = moment(data.createdAt).format("DD/MM/YYYY HH:mm");
  const formattedUpdatedAt = moment(data.updatedAt).format("DD/MM/YYYY HH:mm");
  const dataFormatted = {
    _id: data._id,
    id: data.id,
    title: data.title,
    resume: data.resume,
    content: data.content,
    image: data.image,
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
  };

  return dataFormatted;
};
