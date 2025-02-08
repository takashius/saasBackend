import Products from "./model";
import moment from "moment";
import Categories from "../categories/model";
import { ProductResponse } from "../../types/product";
import { StoreResponse } from "../../types/general";
import { removeImage } from "../../middleware/saveFile";

export async function getProduct(id: string) {
  try {
    let query: any = { active: true };
    if (id) {
      query = { _id: id };
    }

    const result: any = await Products.findOne(query)
      .select(
        "id name description price category discount image user company comments createdAt updatedAt"
      )
      .populate("category", "name")
      .populate("user", "name lastName")
      .populate("comments.user", "name lastName")
      .populate("company", "_id name");
    const formattedCreatedAt = moment(result.createdAt).format(
      "DD/MM/YYYY HH:mm"
    );
    const formattedUpdatedAt = moment(result.updatedAt).format(
      "DD/MM/YYYY HH:mm"
    );

    if (!result) {
      return { status: 404, message: "Product not found" };
    }

    const resultFormatted = {
      _id: result._id,
      id: result.id,
      name: result.name,
      description: result.description,
      price: result.price,
      category: result.category,
      discount: result.discount,
      image: result.image,
      user: result.user,
      company: result.company,
      comments: result.comments,
      finalPrice: result.finalPrice,
      createdAt: formattedCreatedAt,
      updatedAt: formattedUpdatedAt,
    };

    return {
      status: 200,
      message: resultFormatted,
    };
  } catch (e) {
    console.log("[ERROR] -> getProduct", e);
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
    let select = "id name";

    const result = await Products.find(query)
      .select(select)
      .sort({ name: "asc" });

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

export async function getFeatured() {
  try {
    let query: any = { active: true };

    const result = await Products.aggregate([
      { $match: query },
      { $sample: { size: 5 } },
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $lookup: {
          from: "users",
          localField: "comments.user",
          foreignField: "_id",
          as: "comments.user",
        },
      },
      {
        $lookup: {
          from: "companies",
          localField: "company",
          foreignField: "_id",
          as: "company",
        },
      },
      { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          price: 1,
          category: { _id: 1, name: 1 },
          discount: 1,
          image: 1,
          user: { name: 1, lastName: 1 },
          comments: {
            user: { name: 1, lastName: 1 },
          },
          history: 1,
          company: { _id: 1, name: 1 },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]).exec();

    const formattedResult = result.map((post) => {
      return {
        _id: post._id,
        id: post.id,
        name: post.name,
        description: post.description,
        price: post.price,
        category: post.category,
        discount: post.discount,
        image: post.image,
        user: post.user,
        company: post.company,
        comments: post.comments,
        finalPrice: post.price - post.price * (post.discount / 100),
        createdAt: moment(post.createdAt).format("DD/MM/YYYY HH:mm"),
        updatedAt: moment(post.updatedAt).format("DD/MM/YYYY HH:mm"),
      };
    });

    return {
      status: 200,
      message: formattedResult,
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

export async function getProductByCategory(category: string) {
  try {
    let query: any = { active: true, category: category };
    const categoryFound: any = await Categories.findOne({
      active: true,
      _id: category,
    }).select("name");
    if (!categoryFound) {
      throw "No category found";
    }
    const result: any = await Products.find(query)
      .select(
        "id name description price category discount image user company comments createdAt updatedAt"
      )
      .populate("category", "_id name")
      .populate("user", "name lastName")
      .populate("comments.user", "name lastName")
      .populate("company", "_id name");

    const formattedResult = result.map((post) => {
      return {
        _id: post._id,
        id: post.id,
        name: post.name,
        description: post.description,
        price: post.price,
        category: post.category,
        discount: post.discount,
        image: post.image,
        user: post.user,
        company: post.company,
        comments: post.comments,
        finalPrice: post.price - post.price * (post.discount / 100),
        createdAt: moment(post.createdAt).format("DD/MM/YYYY HH:mm"),
        updatedAt: moment(post.updatedAt).format("DD/MM/YYYY HH:mm"),
      };
    });

    return {
      status: 200,
      message: { category: categoryFound.name, products: formattedResult },
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
  page: number,
  company?: string,
  user?: string
): Promise<StoreResponse> {
  try {
    const limit = 10;
    let query: any = { active: true };
    let select = "";
    if (filter) {
      const categories = await Categories.find({
        name: { $regex: filter, $options: "i" },
      }).select("_id");
      const categoryIds = categories.map((category) => category._id);

      query.$or = [
        { name: { $regex: filter, $options: "i" } },
        { description: { $regex: filter, $options: "i" } },
        { category: { $in: categoryIds } },
      ];
    }
    if (company) {
      query.company = company;
    }
    if (user) {
      query.user = user;
    }
    select =
      "id name description price discount category image createdAt updatedAt";

    const result = await Products.find(query)
      .select(select)
      .populate("category", "name")
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
    const totalProducts = await Products.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / limit);
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
        totalProducts,
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

export async function addProduct(
  product: ProductResponse,
  file: any,
  user: any,
  companyId: string
): Promise<StoreResponse> {
  try {
    const data: any = new Products({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      discount: product.discount,
      image: file?.path ? file.path : "",
      user,
      company: companyId,
    });
    await data.save();

    return { status: 201, message: formattedProduct(data) };
  } catch (e) {
    return {
      status: 500,
      message: "Product registration error",
      detail: e,
    };
  }
}

export async function updateProduct(
  post: ProductResponse,
  file: any
): Promise<StoreResponse> {
  try {
    const foundProduct = await Products.findOne({ _id: post._id });
    if (!foundProduct) {
      throw new Error("No post found");
    }
    const changes: { [key: string]: any } = {};

    if (post.name && post.name !== foundProduct.name) {
      changes["name"] = post.name;
      foundProduct.name = post.name;
    }

    if (post.description && post.description !== foundProduct.description) {
      changes["description"] = post.description;
      foundProduct.description = post.description;
    }

    if (post.price && post.price !== foundProduct.price) {
      changes["price"] = post.price;
      foundProduct.price = post.price;
    }

    if (post.category && post.category !== foundProduct.category) {
      changes["category"] = post.category;
      foundProduct.category = post.category;
    }

    if (
      post.discount !== undefined &&
      post.discount !== foundProduct.discount
    ) {
      changes["discount"] = post.discount;
      foundProduct.discount = post.discount;
    }

    if (file) {
      if (foundProduct.image) {
        removeImage(foundProduct.image);
      }
      changes["image"] = file.path;
      foundProduct.image = file.path;
    }

    if (Object.keys(changes).length > 0) {
      foundProduct.history.push({
        date: new Date(),
        changes,
      });
    }

    await foundProduct.save();
    return { status: 200, message: formattedProduct(foundProduct) };
  } catch (e) {
    return {
      status: 500,
      message: "Unexpected store error",
      detail: e,
    };
  }
}

export async function deleteProduct(id: string): Promise<StoreResponse> {
  try {
    const foundProduct = await Products.findOne({
      _id: id,
    });
    if (!foundProduct) {
      throw new Error("No Product found");
    }
    foundProduct.active = false;
    foundProduct.save();

    return { status: 200, message: "Product deleted" };
  } catch (e) {
    console.log("[ERROR] -> deleteProduct", e);
    return {
      status: 400,
      message: "An error occurred while deleting the product",
      detail: e,
    };
  }
}

const formattedProduct = (data: any) => {
  const formattedCreatedAt = moment(data.createdAt).format("DD/MM/YYYY HH:mm");
  const formattedUpdatedAt = moment(data.updatedAt).format("DD/MM/YYYY HH:mm");
  const productFormatted = {
    _id: data._id,
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
    category: data.category,
    discount: data.discount,
    image: data.image,
    finalPrice: data.finalPrice,
    createdAt: formattedCreatedAt,
    updatedAt: formattedUpdatedAt,
  };

  return productFormatted;
};
