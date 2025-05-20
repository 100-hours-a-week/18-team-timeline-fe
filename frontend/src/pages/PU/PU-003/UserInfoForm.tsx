import { useState, type DetailedHTMLProps, type HTMLAttributes } from "react";
import clsx from "clsx";
import { Input } from "@/components/form/Input";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Text } from "@/components/ui/Text";
import { StaticField } from "../components/ui/StaticField";
import { InputModal } from "@/components/ui/Modal";
import { useUserInfoLogic } from "./UserInfoLogic";
import { useRequestStore } from "@/stores/requestStore";
import { ENDPOINTS } from "@/constants/url";
import { Toast } from "@/components/ui/Toast";

type UserInfoFormProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {}

export const UserInfoForm = ({}: UserInfoFormProps) => {
  const [toastMessage, setToastMessage] = useState("")

  const {
    email,
    password, setPassword,
    name, setName,
    checkNameDuplicate,
    isInputModalOpen, setIsInputModalOpen,
    errors, isButtonActive, handleSubmit,
  } = useUserInfoLogic({ setToastMessage });


  const { deleteData } = useRequestStore()

  const handleDeleteAccount = () => {
    setIsInputModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsInputModalOpen(false);
    try {
      const res = await deleteData(ENDPOINTS.USER_WITHDRAW);
      if (res?.success) {
        localStorage.clear()
        alert("회원탈퇴 처리되었습니다.");
      }
    } catch (e) {
      console.error("유저 탈퇴 실패", e);
      alert("비밀번호가 일치하지 않습니다.");
    }
  };

  const handleCancelDelete = () => {
    setPassword('')
    setIsInputModalOpen(false);
  };

  const formClass = clsx("w-full flex flex-col justify-center", "space-y-3");
  const buttonClass = clsx("flex flex-col pt-8 space-y-1");
  const navigationClass = clsx("w-full justify-center flex flex-row space-x-1", "text-sm text-navText");
  const linkClass = clsx("hover:text-navTextHover");

  return (
    <>
      <form className={formClass} onSubmit={handleSubmit}>
        <StaticField
          label="이메일"
          content={email}
        />
        <Input
          labelName="닉네임"
          required={true}
          placeholder="닉네임을 입력하세요."
          maxLength={10}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={checkNameDuplicate}
          helperText={errors.name}
        />
        <div className={buttonClass}>
          <Button text="수정하기" isActive={isButtonActive} />
          <div className={navigationClass}>
            <Link to={''} className={linkClass}>
              <Text>비밀번호 변경</Text>
            </Link>
            <Text>|</Text>
            <button type="button" className={linkClass} onClick={handleDeleteAccount}>
              <Text>회원탈퇴</Text>
            </button>
          </div>
        </div>
      </form>

      <InputModal
        isOpen={isInputModalOpen}
        title="정말 탈퇴하시겠습니까?"
        content="회원탈퇴를 원하시면 비밀번호를 입력해 주세요."
        password={password}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};