import { PhoneInputField } from "./PhoneInputField";
import { EmailInputField } from "./EmailInputField";
import { UserNameInputField } from "./UserNameInputField";
import { GenderSelectField } from "./GenderSelectField";
import { BirthdateCalendarField } from "./BirthdateCalendarField";
import { DniInputField } from "./DniInputField";
import { AddressInputField } from "./AddressInputField";
import { SwitchField } from "./SwitchField";
import { useForm } from "react-hook-form";
import React from "react";
import ImageUploader from "./ImageUploader";
import { SelectRoles } from "./SelectRoles";
import "../../styles/form.css";
import { EmployeeCategoriesCheck } from "./EmployeeCategoriesCheck";

interface UpdateUserInputsProps {
    register: ReturnType<typeof useForm>["register"];
    control: any;
    errors: any;
    phoneNumberError: string;
    emailError: string;
    nameError: string;
    dniError: string;
    birthdateError: string;
    selectedGender: string;
    setSelectedGender: (gender: string) => void;
    birthdate: Date | undefined;
    setBirthdate: (date: Date | undefined) => void;
    photo: string;
    setPhoto: (photo: string) => void;
    phoneNumber: string;
    setPhoneNumber: (phoneNumber: string) => void;
    email: string;
    setEmail: (email: string) => void;
    name: string;
    setName: (name: string) => void;
    dni: string;
    setDni: (dni: string) => void;
    address: string;
    setAddress: (address: string) => void;
    active: boolean;
    setActive: (active: boolean) => void;
    roles: string[];
    selectedRoles: string[];
    setSelectedRoles: (roles: string[]) => void;
    editable: boolean;
    createdDate: string;
    isEmployee: boolean;
    isSuperAdmin: boolean;
    selectedCategories: string[];
    onSelectedCategories: (categories: string[]) => void;
    isCategoriesOpen?: boolean;
}

export const UpdateUserInputs: React.FC<UpdateUserInputsProps> = ({
    register, control, errors, phoneNumberError, emailError, nameError, dniError,
    birthdateError, selectedGender, setSelectedGender, birthdate, setBirthdate, photo, setPhoto,
    phoneNumber, setPhoneNumber, email, setEmail, name, setName, dni, setDni, address,
    setAddress, active, setActive, roles, selectedRoles, setSelectedRoles, editable,
    isEmployee, isSuperAdmin, createdDate, selectedCategories, onSelectedCategories, isCategoriesOpen
}) => {
    return (
        <>
            <div className="input-group">
                <div style={{ flex: "1 0 50%" }}>
                    <PhoneInputField register={register} errors={errors} style={{ width: "80%" }}
                        phoneNumberError={phoneNumberError} value={phoneNumber}
                        onChange={(value) => setPhoneNumber(value)} disabled={!editable} />
                </div>

                <div style={{ flex: "1 0 50%" }}>
                    <EmailInputField register={register} errors={errors} emailError={emailError}
                        style={{ width: "80%" }} value={email}
                        onChange={(value) => setEmail(value)} disabled={!editable} />
                </div>

                <div style={{ flex: "1 0 50%" }}>
                    <UserNameInputField register={register} errors={errors} nameError={nameError}
                        style={{ width: "80%" }} value={name}
                        onChange={(value) => setName(value)} disabled={!editable} />
                </div>

                <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex' }}>
                    <GenderSelectField control={control} errors={errors} value={selectedGender}
                        style={{ width: "100%" }} controlStyle={{ width: "80%" }} disabled={!editable}
                        onChange={(value) => setSelectedGender(value)} />
                </div>
                <div style={{ flex: "1 0 50%", display: 'flex', flexDirection: 'column', rowGap: "30px", justifyContent: "center", alignItems: 'center' }}>
                    <BirthdateCalendarField control={control} errors={errors} value={birthdate}
                        birthdateError={birthdateError} onChange={(value) => setBirthdate(value)}
                        style={{ width: "80%" }} disabled={!editable} />
                    {isEmployee &&
                        <DniInputField register={register} errors={errors} dniError={dniError}
                            style={{ width: "80%" }} value={dni}
                            onChange={(value) => setDni(value)} disabled={!editable} />
                    }
                </div>
                {isEmployee ?
                    <div style={{ flex: "1 0 50%", alignItems: 'center', display: "flex", flexDirection: 'column' }}>
                        <ImageUploader image={photo} text='Haz click o arrastra una foto de perfil'
                            onImageChange={(photo) => setPhoto(photo ?? '')}
                            disabled={!editable} />
                    </div>
                    : <div style={{ flex: "1 0 50%" }}></div>
                }

                {isEmployee &&
                    <>
                        <div style={{ flex: "1 0 50%" }}>
                            <AddressInputField register={register} errors={errors} style={{ width: "80%" }}
                                value={address} onChange={(value) => setAddress(value)}
                                disabled={!editable} />
                        </div>
                        <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex', maxWidth: "50%" }}>
                            <SelectRoles roles={roles}
                                selectedRoles={selectedRoles}
                                disabled={isSuperAdmin ? true : !editable}
                                onAddRole={(role) => setSelectedRoles([...selectedRoles, role])}
                                onRemoveRole={(role) => setSelectedRoles(selectedRoles.filter(r => r !== role))} />
                        </div>
                        <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex', width: "50%" }}>
                            <div style={{ width: '80%' }}>
                                <EmployeeCategoriesCheck selectedCategories={selectedCategories}
                                    onSelectedCategories={onSelectedCategories}
                                    disabled={!isCategoriesOpen || (isSuperAdmin ? true : !editable)} />
                            </div>
                        </div>
                        <div style={{ flex: "1 0 50%" }}></div>
                    </>
                }

            </div>
            <div style={{ width: '50%', display: "flex", justifyContent: "center", flexDirection: "column", alignItems: "center", gap: "20px" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", width: "80%" }}>
                    <SwitchField active={active} onChange={(value) => setActive(value)}
                        disabled={isSuperAdmin ? true : !editable}
                        label={active ? "Activo" : "Inactivo"} />
                    <p>Fecha de creación: {createdDate}</p>
                </div>
            </div>
        </>
    )
}