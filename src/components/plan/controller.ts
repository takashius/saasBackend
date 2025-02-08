import {
  getPlan as _getPlan,
  getSimple,
  getPublic,
  getPaginate,
  addPlan as _addPlan,
  updatePlan as _updatePlan,
  deletePlan as _deletePlan,
} from "./store";

export async function getPlan(planId: string) {
  try {
    if (!planId) {
      return {
        status: 400,
        message: "No plan ID received",
      };
    }
    const result = await _getPlan(planId);
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

export async function getPlanes(filter: string, page: number, simple: boolean) {
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
          name: item.name,
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

export async function getPublicPlanes() {
  try {
    const result = await getPublic();
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

export async function addPlan(plan: any, user: any, company: any) {
  try {
    return await _addPlan(plan, user, company);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}

export async function updatePlan(plan: any) {
  try {
    if (!plan._id) {
      return {
        status: 400,
        message: "No plan ID received",
      };
    }
    const result = await _updatePlan(plan);
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

export async function deletePlan(id: string) {
  try {
    return await _deletePlan(id);
  } catch (e) {
    console.log(e);
    return {
      status: 500,
      message: "Unexpected controller error",
      detail: e,
    };
  }
}
