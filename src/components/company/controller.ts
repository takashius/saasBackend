import {
  getCompany as _getCompany,
  getCompanies as _getCompanies,
  addCompany as _addCompany,
  updateCompany as _updateCompany,
  deleteCompany as _deleteCompany,
  configCompany as _configCompany,
  uploadImage as _uploadImage,
} from "./store";

export async function getCompanies() {
  try {
    const result = await _getCompanies();
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

export async function getCompany(id: string) {
  try {
    if (!id) {
      return {
        status: 400,
        message: "Company ID is required",
      };
    }
    const result = await _getCompany(id);
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

export async function addCompany(company: any, user: any) {
  try {
    const fullCompany = await _addCompany(company, user);
    return fullCompany;
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updateCompany(company: any) {
  try {
    if (!company.id) {
      return {
        status: 400,
        message: "No company ID received",
      };
    }
    const result = await _updateCompany(company);
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

export async function configCompany(company: any, userCompany: any, file: any) {
  try {
    if (!company.id) {
      return {
        status: 400,
        message: "No company ID received",
      };
    }
    if (!userCompany.equals(company.id)) {
      return {
        status: 401,
        message: "You do not have access to the company you are trying to edit",
      };
    }
    const result = await _configCompany(company, file);
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

export async function uploadImage(
  company: string,
  imageType: string,
  file: any
) {
  try {
    const result = await _uploadImage(company, imageType, file);
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

export async function deleteCompany(id: string) {
  try {
    const result = await _deleteCompany(id);
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
