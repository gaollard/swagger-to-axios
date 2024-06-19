import { method } from "@/utils/request";

export const removeAuctionProduct = (params: RemoveAuctionProductReq) => {
  return undefined<{}>({
    url: "/api/mall-sms-auction/removeAuctionProduct",
    method: "POST",
    data: params
  });
}