export const ssr = false

export async function load({ params }) {
  return {
    billId: params.billId
  }
}
