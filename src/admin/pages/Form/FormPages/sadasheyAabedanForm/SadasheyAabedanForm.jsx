import { Form, Input, Select, Button, Upload, message, Spin } from "antd";
import { useMemo, useState } from "react";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import {
  addUser,
  editUser,
  getBloodGroup,
  getForeignSkills,
  getProvinceWithDistMuni,
} from "../../../../../apis/routes/personal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const { Option } = Select;

const PersonalInfoForm = ({
  refetch,
  setIsModalOpen,
  form,
  mode,
  initialValues,
}) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  // const [district, setDistrict] = useState([]);
  const queryClient = useQueryClient();

  console.log("hhhh", initialValues?.id);

  const handleSameAddress = (e) => {
    setSameAsPermanent(e.target.checked);
    if (e.target.checked) {
      const permanentValues = form.getFieldsValue([
        "permanentProvince",
        "permanentDistrict",
        "permanentMunicipality",
        "permanentWard",
        "permanentTole",
      ]);
      form.setFieldsValue({
        temporaryProvince: permanentValues.permanentProvince,
        temporaryDistrict: permanentValues.permanentDistrict,
        temporaryMunicipality: permanentValues.permanentMunicipality,
        temporaryWard: permanentValues.permanentWard,
        temporaryTole: permanentValues.permanentTole,
      });
    }
  };

  const addUserFn = useMutation({
    mutationFn: addUser,
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: () => {
      messageApi.success("User added successfully!");
      queryClient.invalidateQueries({ queryKey: ["addUser"] });
      queryClient.refetchQueries({ queryKey: ["addUser"] });
      setIsModalOpen(false);
      refetch();
      form.resetFields();
    },
    onError: () => {
      messageApi.error("Failed to add addUser");
    },
    onMutate: () => {
      setLoading(true);
    },
  });

  const updateUser = useMutation({
    mutationFn: editUser,
    onSettled: () => {
      setLoading(false);
    },
    onSuccess: () => {
      messageApi.success("User update successfully!");
      queryClient.invalidateQueries({ queryKey: ["updateUser"] });
      queryClient.refetchQueries({ queryKey: ["updateUser"] });
      setIsModalOpen(false);
      refetch();
      form.resetFields();
    },
    onError: () => {
      messageApi.error("Failed to updateUser");
    },
    onMutate: () => {
      setLoading(true);
    },
  });
  const onFinish = (values) => {
    // const formData = new FormData();
    // formData.append("name", values.name);
    const finalData = {
      ...values,
      id: initialValues?.id,
      // profilePhoto: values.profilePhoto.file.name,
      foreignSkills: Array.isArray(values.foreignSkills)
        ? values.foreignSkills.join(", ")
        : values.foreignSkills,
    };

    mode === "add"
      ? addUserFn.mutateAsync(finalData)
      : updateUser.mutateAsync(finalData);
    console.log("Form submitted with values:", values);
    console.log("Uploaded image URL:", finalData);
  };

  const { data } = useQuery({
    queryKey: ["provinceWithDistMuni"],
    queryFn: getProvinceWithDistMuni,
  });

  const { data: foreignSkills } = useQuery({
    queryKey: ["foreignSkills"],
    queryFn: getForeignSkills,
  });

  const { data: bloodGroup } = useQuery({
    queryKey: ["bloodGroup"],
    queryFn: getBloodGroup,
  });

  console.log("aa", bloodGroup?.data);

  const selectedProvinceIndex = Form.useWatch("permanentProvince", form);

  const district = useMemo(() => {
    if (selectedProvinceIndex !== undefined) {
      return data?.data?.[selectedProvinceIndex]?.districts || [];
    }
    return [];
  }, [selectedProvinceIndex, data]);

  const selectedDistrictIndex = Form.useWatch("permanentDistrict", form);

  const municipality = useMemo(() => {
    if (selectedDistrictIndex !== undefined) {
      return district[selectedDistrictIndex]?.municipalities || [];
    }
    return [];
  }, [selectedDistrictIndex, district]);

  const selectedTemporaryProvinceIndex = Form.useWatch(
    "temporaryProvince",
    form
  );

  const temporaryDistrict = useMemo(() => {
    if (selectedTemporaryProvinceIndex !== undefined) {
      return data?.data?.[selectedTemporaryProvinceIndex]?.districts || [];
    }
    return [];
  }, [selectedTemporaryProvinceIndex, data]);

  const selectedTemporaryDistrictIndex = Form.useWatch(
    "temporaryDistrict",
    form
  );

  const temporaryMunicipality = useMemo(() => {
    if (selectedTemporaryDistrictIndex !== undefined) {
      return (
        temporaryDistrict[selectedTemporaryDistrictIndex]?.municipalities || []
      );
    }
    return [];
  }, [selectedTemporaryDistrictIndex, temporaryDistrict]);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 bg-white rounded-2xl shadow-xl">
      {contextHolder}
      <Spin spinning={loading}>
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          व्यक्तिगत विवरण फारम (Personal Information Form)
        </h2>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="space-y-6"
        >
          {/* Profile Photo */}
          <Form.Item
            label={<span className="font-semibold">Profile Photo</span>}
            name="profilePhoto"
            // rules={[{ required: true, message: "Please upload your photo" }]}
          >
            <Upload
              listType="picture-card"
              showUploadList={false}
              customRequest={({ file, onSuccess }) => {
                setTimeout(() => {
                  onSuccess("ok");
                }, 0);
                setImageUrl(URL.createObjectURL(file));
              }}
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="avatar"
                  className="rounded-xl w-full"
                />
              ) : (
                <div>
                  <div className="text-gray-500">Upload Photo</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Form.Item
              label="नाम थर (Name Surname)"
              name="name"
              rules={[{ required: true, message: "Please input your name!" }]}
            >
              <Input className="rounded-md" />
            </Form.Item>
            <Form.Item
              label="In English Alphabet"
              name="nameEnglish"
              rules={[
                {
                  required: true,
                  message: "Please input your name in English",
                },
              ]}
            >
              <Input className="rounded-md" />
            </Form.Item>
          </div>

          {/* Permanent Address */}
          <Form.Item label="स्थायी ठेगाना (Permanent Address)">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Form.Item
                label="प्रदेश (Province)"
                name="permanentProvince"
                rules={[{ required: true, message: "Province is required" }]}
              >
                <Select
                // onSelect={(e) => {
                //   const datas = data.data[e];
                //   setDistrict(datas?.districts);
                // }}
                >
                  {data?.data?.map((item, index) => (
                    <Option key={index}>
                      {item.province_name} ({item.province_nepali_name})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="जिल्ला (District)"
                name="permanentDistrict"
                rules={[{ required: true, message: "District is required" }]}
              >
                <Select>
                  {district?.map((districts, index) => (
                    <Option key={index}>
                      {districts.name}({districts.nepali_name})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="पालिका (Municipality)"
                name="permanentMunicipality"
                rules={[
                  { required: true, message: "Municipality is required" },
                ]}
              >
                <Select>
                  {municipality?.map((muni, index) => (
                    <Option key={index}>
                      {console.log("prov", muni)} {muni.name}({muni.nepali_name}
                      )
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="वार्ड (Ward)"
                name="permanentWard"
                rules={[{ required: true, message: "Ward is required" }]}
              >
                <Select>
                  {[...Array(20).keys()].map((i) => (
                    <Option key={i + 1} value={`ward${i + 1}`}>
                      {i + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="टोल (Tole)"
                name="permanentTole"
                rules={[{ required: true, message: "Tole is required" }]}
              >
                <Input />
              </Form.Item>
            </div>
          </Form.Item>

          {/* Temporary Address */}
          <Form.Item
            label={
              <div className="flex justify-between items-center">
                <span>अस्थायी ठेगाना (Temporary Address)</span>
                <label className="text-sm font-medium">
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={sameAsPermanent}
                    onChange={handleSameAddress}
                  />
                  Same as permanent
                </label>
              </div>
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Form.Item
                label="प्रदेश (Province)"
                name="temporaryProvince"
                rules={[{ required: true, message: "Province is required" }]}
              >
                <Select disabled={sameAsPermanent}>
                  {data?.data?.map((item, index) => (
                    <Option key={index}>
                      {item.province_name} ({item.province_nepali_name})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="जिल्ला (District)"
                name="temporaryDistrict"
                rules={[{ required: true, message: "District is required" }]}
              >
                <Select disabled={sameAsPermanent}>
                  {temporaryDistrict?.map((districts, index) => (
                    <Option key={index}>
                      {districts.name}({districts.nepali_name})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="पालिका (Municipality)"
                name="temporaryMunicipality"
                rules={[
                  { required: true, message: "Municipality is required" },
                ]}
              >
                <Select disabled={sameAsPermanent}>
                  {temporaryMunicipality?.map((muni, index) => (
                    <Option key={index}>
                      {console.log("prov", muni)} {muni.name}({muni.nepali_name}
                      )
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="वार्ड (Ward)"
                name="temporaryWard"
                rules={[{ required: true, message: "Ward is required" }]}
              >
                <Select disabled={sameAsPermanent}>
                  {[...Array(20).keys()].map((i) => (
                    <Option key={i + 1} value={`ward${i + 1}`}>
                      {i + 1}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                label="टोल (Tole)"
                name="temporaryTole"
                rules={[{ required: true, message: "Tole is required" }]}
              >
                <Input disabled={sameAsPermanent} />
              </Form.Item>
            </div>
          </Form.Item>

          {/* Other Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item label="जन्म मिति (Date of Birth)" required>
              <Form.Item
                name="dob"
                noStyle
                rules={[{ required: true, message: "जन्म मिति आवश्यक छ" }]}
              >
                <NepaliDatePicker
                  onChange={(value) => form.setFieldsValue({ dob: value })}
                  inputClassName="w-full p-1 rounded-md border border-gray-300"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="रक्त समूह (Blood Group)"
              name="bloodGroup"
              rules={[{ required: true, message: "Blood group is required" }]}
            >
              <Select placeholder="Select">
                {bloodGroup?.data?.map((item, index) => (
                  <Option key={index}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="मोबाइल नं. (Mobile No.)"
              name="mobile"
              rules={[{ required: true, message: "Mobile number is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="इमेल (Email)"
              name="email"
              rules={[
                { required: true, message: "Email is required" },
                { type: "email", message: "Invalid email format" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="नागरिकता नं. (Citizenship No.)"
              name="citizenship"
              rules={[
                { required: true, message: "Citizenship number is required" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="पासपोर्ट नं. (Passport No.)"
              name="passport"
              rules={[
                { required: true, message: "Passport number is required" },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="देश (Country)"
              name="country"
              rules={[{ required: true, message: "Country is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item label="फर्किएको मिति (Date of Return)" required>
              <Form.Item
                name="returnDate"
                noStyle
                rules={[{ required: true, message: "फर्किएको मिति आवश्यक छ" }]}
              >
                <NepaliDatePicker
                  onChange={(value) =>
                    form.setFieldsValue({ returnDate: value })
                  }
                  inputClassName="w-full p-1 rounded-md border border-gray-300"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item
              label="विदेशमा विताएको अवधि (Period Abroad)"
              name="timeSpendAbroad"
              rules={[{ required: true, message: "This field is required" }]}
            >
              <Input type="number" />
            </Form.Item>
          </div>

          {/* Skills & Education */}
          <Form.Item
            label="विदेशमा सिकेको सिप / तालिम"
            name="foreignSkills"
            rules={[
              { required: true, message: "Please select at least one skill" },
            ]}
          >
            <Select mode="multiple" allowClear placeholder="Select your skill">
              {foreignSkills?.data?.map((item, index) => (
                <Option key={index}>{item.name}</Option>
              ))}
              <Option value="other">अन्य (Other)</Option>
            </Select>
          </Form.Item>

          {/* Conditional Other Skill Input */}
          <Form.Item
            noStyle
            shouldUpdate={(prev, curr) =>
              prev.foreignSkills !== curr.foreignSkills
            }
          >
            {({ getFieldValue }) =>
              getFieldValue("foreignSkills")?.includes("other") ? (
                <Form.Item
                  name="otherForeignSkills"
                  label="कृपया अन्य सिप / तालिमको विवरण लेख्नुहोस्"
                  rules={[
                    { required: true, message: "Please specify your skills" },
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              ) : null
            }
          </Form.Item>

          {/* Education/Occupation */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Form.Item
              label="शैक्षिक योग्यता (Education)"
              name="education"
              rules={[{ required: true, message: "Education is required" }]}
            >
              <Select placeholder="Select">
                <Option value="bachelors">Bachelors</Option>
                <Option value="masters">Masters</Option>
                <Option value="phd">PhD</Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="पेशा (Occupation)"
              name="occupation"
              rules={[{ required: true, message: "Occupation is required" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="संस्था (Organization)"
              name="organization"
              rules={[{ required: true, message: "Organization is required" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="पद (Position)"
              name="position"
              rules={[{ required: true, message: "Position is required" }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            label="कार्य अनुभव (Work Experience)"
            name="experience"
            rules={[
              { required: true, message: "Please provide work experience" },
            ]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          {/* Submit */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            >
              {mode === "add" ? "Submit" : "Update"}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </div>
  );
};

export default PersonalInfoForm;
