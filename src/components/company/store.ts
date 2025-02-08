import Company from "./model";
import Plan from "../plan/model";
import { removeImage } from "../../middleware/saveFile";
import { StoreResponse } from "../../types/general";
import { Types } from "mongoose";

export async function getCompany(id: string): Promise<StoreResponse> {
  try {
    let query: any = { active: true };
    if (id) {
      query = { _id: id };
    }

    const result = await Company.findOne(query).populate({
      path: "created.user",
      select: ["name", "lastName"],
      model: "User",
    });
    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getCompany", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function getCompanies(): Promise<StoreResponse> {
  try {
    const query = { active: true };

    const result = await Company.find(query).populate({
      path: "created.user",
      select: ["name", "lastName"],
      model: "User",
    });
    return {
      status: 200,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> getCompanies", e);
    return {
      status: 400,
      message: "Results error",
      detail: e,
    };
  }
}

export async function addCompany(
  data: any,
  user: string
): Promise<StoreResponse> {
  try {
    const companyData = {
      name: data.name,
      description: data.description,
      email: data.email,
      phone: data.phone,
      rif: data.rif,
      address: data.address,
      logo: data.logo,
      logoAlpha: data.logoAlpha,
      created: {
        user: user,
      },
    };

    const company = new Company(companyData);
    const plan = await Plan.findOne({ name: "Free" });
    if (!plan) {
      throw new Error("Plan not found");
    }

    const registrationDate = new Date();
    const expiryDate = new Date(registrationDate);
    expiryDate.setMonth(expiryDate.getMonth() + 1);

    if (expiryDate.getDate() !== registrationDate.getDate()) {
      expiryDate.setDate(0);
    }

    company.currentPlan = {
      plan: plan._id as Types.ObjectId,
      registrationDate,
      expiryDate,
    };
    const result = await company.save();
    return {
      status: 201,
      message: result,
    };
  } catch (e) {
    console.log("[ERROR] -> addCompany", e);
    return {
      status: 400,
      message: "An error occurred while creating the company",
      detail: e,
    };
  }
}

export async function updateCompany(data: any): Promise<StoreResponse> {
  try {
    const foundCompany = await Company.findOne({
      _id: data.id,
    });
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    if (data.name) {
      foundCompany.name = data.name;
    }
    if (data.description) {
      foundCompany.description = data.description;
    }
    if (data.email) {
      foundCompany.email = data.email;
    }
    if (data.phone) {
      foundCompany.phone = data.phone;
    }
    if (data.rif) {
      foundCompany.rif = data.rif;
    }
    if (data.address) {
      foundCompany.address = data.address;
    }
    if (data.logo) {
      foundCompany.logo = data.logo;
    }
    if (data.logoAlpha) {
      foundCompany.logoAlpha = data.logoAlpha;
    }

    await foundCompany.save();
    return {
      status: 200,
      message: "Company updated successfully",
    };
  } catch (e) {
    console.log("[ERROR] -> updateCompany", e);
    return {
      status: 400,
      message: "An error occurred while updating the company",
      detail: e,
    };
  }
}

export async function configCompany(
  data: any,
  file: any
): Promise<StoreResponse> {
  try {
    const foundCompany = await Company.findOne({
      _id: data.id,
    });
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    if (data.iva) {
      foundCompany.iva = data.iva;
    }
    if (data.address) {
      foundCompany.address = data.address;
    }
    if (data.description) {
      foundCompany.description = data.description;
    }
    if (data.phone) {
      foundCompany.phone = data.phone;
    }
    if (data.rif) {
      foundCompany.rif = data.rif;
    }
    if (data.imageType) {
      switch (data.imageType) {
        case "logo":
          removeImage(foundCompany.logo);
          foundCompany.logo = file.path;
          break;
        case "logoAlpha":
          removeImage(foundCompany.logoAlpha);
          foundCompany.logoAlpha = file.path;
          break;
        case "banner":
          removeImage(foundCompany.banner);
          foundCompany.banner = file.path;
          break;
      }
    }
    if (data.currencySymbol) {
      foundCompany.currencySymbol = data.currencySymbol;
    }

    if (foundCompany.configMail) {
      if (foundCompany.configMail.colors) {
        if (data.configMail?.colors?.primary) {
          foundCompany.configMail.colors.primary =
            data.configMail?.colors?.primary;
        }
        if (data.configMail?.colors?.secondary) {
          foundCompany.configMail.colors.secondary =
            data.configMail?.colors?.secondary;
        }
        if (data.configMail?.colors?.background) {
          foundCompany.configMail.colors.background =
            data.configMail?.colors?.background;
        }
        if (data.configMail?.colors?.title) {
          foundCompany.configMail.colors.title = data.configMail?.colors?.title;
        }
        if (data.configMail?.textBody) {
          foundCompany.configMail.textBody = data.configMail?.textBody;
        }
      }
    }
    if (foundCompany.configPdf) {
      if (foundCompany.configPdf.logo) {
        if (data.pdf?.logo?.x) {
          foundCompany.configPdf.logo.x = data.pdf?.logo?.x;
        }
        if (data.pdf?.logo?.y) {
          foundCompany.configPdf.logo.y = data.pdf?.logo?.y;
        }
        if (data.pdf?.logo?.width) {
          foundCompany.configPdf.logo.width = data.pdf?.logo?.width;
        }
      }
      if (foundCompany.configPdf.logoAlpha) {
        if (data.pdf?.logoAlpha?.x) {
          foundCompany.configPdf.logoAlpha.x = data.pdf?.logoAlpha?.x;
        }
        if (data.pdf?.logoAlpha?.y) {
          foundCompany.configPdf.logoAlpha.y = data.pdf?.logoAlpha?.y;
        }
        if (data.pdf?.logoAlpha?.width) {
          foundCompany.configPdf.logoAlpha.width = data.pdf?.logoAlpha?.width;
        }
      }
    }

    if (foundCompany.correlatives) {
      if (data.correlatives?.manageInvoiceCorrelative !== undefined) {
        foundCompany.correlatives.manageInvoiceCorrelative =
          data.correlatives?.manageInvoiceCorrelative;
      }
      if (data.correlatives?.invoice) {
        foundCompany.correlatives.invoice = data.correlatives?.invoice;
      }
    }

    await foundCompany.save();
    return {
      status: 200,
      message: "Config updated successfully",
    };
  } catch (e) {
    console.log("[ERROR] -> configCompany", e);
    return {
      status: 400,
      message: "An error occurred while updating the company",
      detail: e,
    };
  }
}

export async function uploadImage(
  id: string,
  imageType: string,
  file: any
): Promise<StoreResponse> {
  try {
    const foundCompany = await Company.findOne({
      _id: id,
    });
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    switch (imageType) {
      case "logo":
        removeImage(foundCompany.logo);
        foundCompany.logo = file.path;
        break;
      case "logoAlpha":
        removeImage(foundCompany.logoAlpha);
        foundCompany.logoAlpha = file.path;
        break;
      case "banner":
        removeImage(foundCompany.banner);
        foundCompany.banner = file.path;
        break;
    }
    await foundCompany.save();
    return {
      status: 200,
      message: file,
    };
  } catch (e) {
    console.log("[ERROR] -> uploadImage", e);
    return {
      status: 400,
      message: "An error occurred while updating the company",
      detail: e,
    };
  }
}

export async function deleteCompany(id: string): Promise<StoreResponse> {
  try {
    const foundCompany = await Company.findOne({
      _id: id,
    });
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    foundCompany.active = false;
    foundCompany.save();

    return { status: 200, message: "Company deleted" };
  } catch (e) {
    console.log("[ERROR] -> deleteCompany", e);
    return {
      status: 400,
      message: "An error occurred while deleting the company",
      detail: e,
    };
  }
}

export async function incrementCorrelative(company: any): Promise<number> {
  try {
    const foundCompany = await Company.findOne(company);
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    let newNumber = 1;
    if (foundCompany.correlatives?.invoice) {
      newNumber = foundCompany.correlatives.invoice + 1;
    }

    if (foundCompany.correlatives)
      foundCompany.correlatives.invoice = newNumber;
    await foundCompany.save();
    return newNumber;
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function getManageCorrelatives(company: any) {
  try {
    const foundCompany = await Company.findOne(company);
    if (!foundCompany) {
      throw new Error("No Company found");
    }
    return (
      foundCompany.correlatives &&
      foundCompany.correlatives.manageInvoiceCorrelative
    );
  } catch (error) {
    console.log(error);
    return true;
  }
}
