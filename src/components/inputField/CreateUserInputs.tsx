import { PhoneInputField } from './PhoneInputField';
import { EmailInputField } from './EmailInputField';
import { UserNameInputField } from './UserNameInputField';
import { GenderSelectField } from './GenderSelectField';
import { BirthdateCalendarField } from './BirthdateCalendarField';
import { DniInputField } from './DniInputField';
import { AddressInputField } from './AddressInputField';
import ImageUploader from '../ImageUploader';
import { SelectRoles } from '../SelectRoles';
import { Control, FieldErrors, FieldValues, useForm } from 'react-hook-form';
import React from 'react';

interface CreateUserInputsProps {
    register: ReturnType<typeof useForm>["register"];
    control: Control<FieldValues>;
    errors: FieldErrors;
    phoneNumberError: string;
    emailError: string;
    nameError: string;
    birthdateError: string;
    dniError: string;
    roles: string[];
    selectedRoles: string[];
    setSelectedRoles: (roles: string[]) => void;
    userType: string;
    selectedGender: string;
    setSelectedGender: (gender: string) => void;
    birthdate: Date | undefined;
    setBirthdate: (date: Date | undefined) => void;
    photo: string;
    setPhoto: (photo: string) => void;
}

export const CreateUserInputs: React.FC<CreateUserInputsProps> = ({
    register, control, errors, phoneNumberError, emailError, nameError, birthdateError,
    dniError, roles, selectedRoles, setSelectedRoles, userType, selectedGender,
    setSelectedGender, birthdate, setBirthdate, photo, setPhoto
}) => {
    return (
        <>
            <div style={{ flex: "1 0 50%" }}>
                <PhoneInputField register={register} errors={errors} phoneNumberError={phoneNumberError} style={{ width: "80%" }} />
            </div>

            <div style={{ flex: "1 0 50%" }}>
                <EmailInputField register={register} errors={errors} emailError={emailError}
                    style={{ width: "80%" }} />
            </div>

            <div style={{ flex: "1 0 50%" }}>
                <UserNameInputField register={register} errors={errors} nameError={nameError}
                    style={{ width: "80%" }} />
            </div>

            <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex' }}>
                <GenderSelectField control={control} errors={errors} value={selectedGender}
                    onChange={(value) => setSelectedGender(value)} style={{ width: "100%" }}
                    controlStyle={{ width: "80%" }} />
            </div>
            <div style={{ flex: "1 0 50%", display: 'flex', flexDirection: 'column', rowGap: "30px", justifyContent: "center", alignItems: 'center' }}>
                <BirthdateCalendarField control={control} errors={errors}
                    birthdateError={birthdateError}
                    value={birthdate} onChange={(value) => setBirthdate(value)}
                    style={{ width: "80%" }} />
                {userType === "empleado" &&
                    <DniInputField register={register} errors={errors} dniError={dniError}
                        style={{ width: "80%" }} />
                }
            </div>
            {userType === "empleado" ?
                <div style={{ flex: "1 0 50%", alignItems: 'center', display: "flex", flexDirection: 'column' }}>
                    <ImageUploader image={photo} text='Haz click o arrastra una foto de perfil'
                        onImageChange={(photo) => setPhoto(photo ?? '')} />
                </div>
                : <div style={{ flex: "1 0 50%" }}></div>
            }

            {userType === "empleado" &&
                <div style={{ flex: "1 0 50%" }}>
                    <AddressInputField register={register} errors={errors} style={{ width: "80%" }} />
                </div>
            }
            {userType === "empleado" &&
                <div style={{ flex: "1 0 50%", justifyContent: "center", alignItems: 'center', display: 'flex', maxWidth: "50%" }}>
                    <SelectRoles roles={roles}
                        selectedRoles={selectedRoles}
                        onAddRole={(role) => setSelectedRoles([...selectedRoles, role])}
                        onRemoveRole={(role) => setSelectedRoles(selectedRoles.filter(r => r !== role))} />
                </div>
            }
        </>
    )
}