"use server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface LeadFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  internet: "인터넷",
  tv: "TV",
  combo: "인터넷+TV",
};
const CATEGORIES = new Set(Object.keys(CATEGORY_LABELS));
const PHONE_REGEX = /^01[0-9]-?\d{3,4}-?\d{4}$/;

export async function submitLead(formData: FormData): Promise<LeadFormState> {
  const category = String(formData.get("category") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const bundleDiscountOptIn = formData.get("bundleDiscountOptIn") === "on";
  const agreeCollection = formData.get("agreeCollection") === "on";
  const agreeThirdParty = formData.get("agreeThirdParty") === "on";
  const agreeAge = formData.get("agreeAge") === "on";
  const agreeMarketing = formData.get("agreeMarketing") === "on";

  if (!CATEGORIES.has(category)) {
    return { status: "error", message: "상품 카테고리를 선택해주세요." };
  }
  if (!name) {
    return { status: "error", message: "이름을 입력해주세요." };
  }
  if (!PHONE_REGEX.test(phone)) {
    return { status: "error", message: "휴대폰번호 형식을 확인해주세요." };
  }
  if (!agreeCollection || !agreeThirdParty || !agreeAge) {
    return { status: "error", message: "필수 동의 항목에 모두 동의해주세요." };
  }

  const categoryLabel = CATEGORY_LABELS[category] ?? category;
  const content = [
    `신청 카테고리: ${categoryLabel}`,
    `결합 할인 안내 수신: ${bundleDiscountOptIn ? "동의" : "미동의"}`,
    `개인정보 수집 및 이용 동의(필수): ${agreeCollection ? "동의" : "미동의"}`,
    `개인정보 제3자 제공 동의(필수): ${agreeThirdParty ? "동의" : "미동의"}`,
    `만 14세 이상 확인(필수): ${agreeAge ? "동의" : "미동의"}`,
    `마케팅 정보 수신 동의(선택): ${agreeMarketing ? "동의" : "미동의"}`,
  ].join("\n");

  const { error } = await supabaseAdmin.from("inquiries").insert({
    source: "landing",
    name,
    phone,
    title: "맞춤혜택 조회 문의가 들어왔습니다",
    content,
    is_scret: false,
  });

  if (error) {
    return { status: "error", message: "접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  }

  return { status: "success", message: "상담 신청이 접수되었습니다. 곧 연락드리겠습니다!" };
}
