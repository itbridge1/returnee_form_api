import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Image,
  Modal,
  message,
  Spin,
  Form,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { deleteUser, getPersonalAll } from "../../../../apis/routes/personal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PersonalInfoForm from "../FormPages/sadasheyAabedanForm/SadasheyAabedanForm";

const UserTable = () => {
  // State Management
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedRecord, setSelectedRecord] = useState(null);
  const queryClient = useQueryClient();

  // Queries and Mutations
  const { data, refetch } = useQuery({
    queryKey: ["personalAll"],
    queryFn: getPersonalAll,
  });
  console.log("data", data?.data?.profilePhoto);

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteUser(id),
    onSettled: () => setLoading(false),
    onSuccess: () => {
      messageApi.success("User deleted successfully!");
      queryClient.invalidateQueries(["personalAll"]);
    },
    onError: (error) => {
      console.error("Error deleting user:", error);
      messageApi.error("Failed to delete user");
    },
    onMutate: () => setLoading(true),
  });

  // Event Handlers
  const handleDelete = (id) => deleteMutation.mutate(id);

  const handleModalOpen = (mode, record) => {
    console.log("record", mode === "edit");

    if (mode === "edit") {
      form.setFieldsValue({
        ...record,
        name: record.name,
      });
    }

    setModalMode(mode);
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setModalMode("add");
    setSelectedRecord(null);
  };

  // Table Columns Configuration
  const columns = [
    {
      title: "फोटो (Photo)",
      dataIndex: "profilePhoto",
      key: "profilePhoto",
      width: 80,
      render: (url) => <Image width={40} src={url} preview={false} />,
    },
    {
      title: "नाम (Name)",
      dataIndex: "name",
      key: "name",
      width: 120,
    },
    {
      title: "अंग्रेजी नाम (English Name)",
      dataIndex: "nameEnglish",
      key: "nameEnglish",
      width: 130,
    },
    {
      title: "स्थाई ठेगाना (Permanent Address)",
      key: "permanentAddress",
      width: 200,
      render: (_, r) => (
        <span>
          {r.permanentProvince}, {r.permanentDistrict},{" "}
          {r.permanentMunicipality}
        </span>
      ),
    },
    {
      title: "अस्थायी ठेगाना (Temporary Address)",
      key: "temporaryAddress",
      width: 200,
      render: (_, r) => (
        <span>
          {r.temporaryProvince}, {r.temporaryDistrict},{" "}
          {r.temporaryMunicipality}
        </span>
      ),
    },
    {
      title: "मोबाइल (Mobile)",
      dataIndex: "mobile",
      key: "mobile",
      width: 130,
    },
    {
      title: "देश (Country)",
      dataIndex: "country",
      key: "country",
      width: 100,
    },
    {
      title: "शिक्षा (Education)",
      dataIndex: "education",
      key: "education",
      width: 150,
    },
    {
      title: "पेशा (Occupation)",
      dataIndex: "occupation",
      key: "occupation",
      width: 150,
    },
    {
      title: "कार्यहरू (Actions)",
      key: "actions",
      width: 120,
      render: (_, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleModalOpen("edit", record)}
          />
          <Popconfirm
            title="Delete the item"
            description="Are you sure to delete this item?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              size="small"
              danger
              color="danger"
              variant="solid"
            >
              <DeleteOutlined />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const styledColumns = columns.map((col) => ({
    ...col,
    onHeaderCell: () => ({
      style: {
        whiteSpace: "normal",
        wordWrap: "break-word",
        textAlign: "center",
      },
    }),
  }));

  return (
    <div className="max-w-screen-2xl mx-auto p-4">
      {contextHolder}
      <Spin spinning={loading}>
        <div className="bg-white shadow-xl rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">
            प्रयोगकर्ता जानकारी (User Information) Table
          </h2>

          <div className="flex justify-end">
            <Button
              type="primary"
              className="mb-2"
              onClick={() => handleModalOpen("add")}
            >
              प्रयोगकर्ता जानकारी थप्नुहोस्
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table
              columns={styledColumns}
              dataSource={data?.data?.map((user, index) => ({
                ...user,
                key: index.toString(),
              }))}
              pagination={{ pageSize: 5 }}
              scroll={{ x: 2500 }}
              bordered
            />
          </div>
        </div>
      </Spin>

      <Modal
        title={modalMode === "add" ? "Add New User" : "Edit User"}
        open={isModalOpen}
        onCancel={handleModalClose}
        width={1000}
        footer={null}
      >
        <PersonalInfoForm
          refetch={refetch}
          setIsModalOpen={setIsModalOpen}
          initialValues={selectedRecord}
          mode={modalMode}
          form={form}
        />
      </Modal>
    </div>
  );
};

export default UserTable;
