import WebpageTable from "@/components/WebpageTable";
import { ContentType } from "@/lib/utils";
import { selectCurrentUser } from "@/redux/features/authSlice";
import { selectCurrentUserBot } from "@/redux/features/botSlice";
import {
  contentServiceApi,
  useCreateContentMutation,
  useDeleteContentMutation,
  useGetContentsQuery,
} from "@/redux/service/contentServiceApi";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { addToast } from "@heroui/toast";
import { Form, FieldArray, useFormik, FormikProvider } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";

export default function WebPageVault() {
  const maxLimit = 5;
  const dispatch = useDispatch();
  const [filesList, setFilesList] = useState<any[]>([]);
  const currentUser = useSelector(selectCurrentUser);
  const currentBot = useSelector(selectCurrentUserBot);

  const { data: contentListFromApi, isLoading } = useGetContentsQuery({
    userId: currentUser.userId,
    botId: currentBot?.id,
    type: "webpage",
  });

  const [CreateContent, { isSuccess: createSuccess, isError: createError }] =
    useCreateContentMutation();

  const [DeleteContent, { isSuccess: deleteSuccess, isError: deleteError }] =
    useDeleteContentMutation();

  useEffect(() => {
    console.log("contentListFromApi", contentListFromApi);

    if (!contentListFromApi && !Array.isArray(contentListFromApi)) return;

    const temp = contentListFromApi.map((content: any) => {
      return {
        id: content.id,
        url: content.content.url,
        date: content.updatedAt,
        status: content.status,
      };
    });

    setFilesList(temp);
  }, [currentUser, contentListFromApi]);

  const [formikData, setFormikData] = useState({
    urls: [
      {
        id: 1,
        url: "",
      },
    ],
  });

  const validationSchema = Yup.object({
    urls: Yup.array()
      .of(
        Yup.object({
          url: Yup.string()
            .matches(
              /^(http|https):\/\/[^ "]+$/,
              "URL must start with http:// or https://"
            )
            .required("URL is required"),
        })
      )
      .required("At least one URL is required")
      .min(1, "At least one URL is required")
      .max(maxLimit, `You can only add up to ${maxLimit} URLs.`),
  });

  const formik = useFormik({
    initialValues: formikData,
    enableReinitialize: true,
    onSubmit: async (values) => {
      // Handle form submission
      for (const content of values.urls) {
        await CreateContent({
          botId: currentBot?.id,
          type: ContentType.webpage,
          content: {
            url: content.url,
          },
        }).unwrap();
      }

      console.log("Form values:", values);
    },
    validationSchema: validationSchema,
  });

  const handleDelete = (id: any) => {
    DeleteContent({ contentId: id });
  };

  useEffect(() => {
    if (deleteSuccess) {
      addToast({
        title: "Success",
        description: "Content deleted successfully",
        color: "success",
      });
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (deleteError) {
      addToast({
        title: "Error",
        description: "Failed to delete content",
        color: "danger",
      });
    }
  }, [deleteError]);

  useEffect(() => {
    if (createSuccess) {
      addToast({
        title: "Success",
        description: "Content created successfully",
        color: "success",
      });
    }

    formik.values.urls = [
      {
        id: 1,
        url: "",
      },
    ];
    setFormikData({
      urls: [
        {
          id: 1,
          url: "",
        },
      ],
    });

    dispatch(contentServiceApi.util.invalidateTags(["ContentCollection"]));
  }, [createSuccess]);

  useEffect(() => {
    if (createError) {
      addToast({
        title: "Error",
        description: "Failed to create content",
        color: "danger",
      });
    }
  }, [createError]);

  return (
    <div className="flex w-full gap-2 p-2">
      <div className="flex justify-center basis-1/2">
        {isLoading && <div>Loading...</div>}
        {!isLoading && filesList.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            No files found
          </div>
        )}

        {!isLoading && filesList.length > 0 && (
          <WebpageTable fileList={filesList} handleDelete={handleDelete} />
        )}
      </div>

      <div className="flex justify-between basis-1/2 w-full">
        <FormikProvider value={formik}>
          <Form onSubmit={formik.handleSubmit} className="w-full">
            <FieldArray
              name="urls"
              render={(arrayHelpers) => (
                <div className="flex flex-col gap-2">
                  {formik.values.urls.map((_, index) => {
                    const fieldName = `urls.${index}.url`;

                    return (
                      <div key={index} className="flex items-center gap-2">
                        <Input
                          isRequired
                          name={fieldName}
                          label={`URL ${index + 1}`}
                          value={formik.values.urls[index].url}
                          placeholder="Enter URL with http:// or https://"
                          onChange={(e) => {
                            formik.setFieldValue(fieldName, e.target.value);
                          }}
                          onValueChange={() =>
                            formik.setFieldTouched(fieldName, true)
                          }
                          type="url"
                          errorMessage={({
                            validationDetails,
                            validationErrors,
                          }) => {
                            if (validationDetails.typeMismatch) {
                              return "Please enter a valid web address starting with http:// or https://";
                            }

                            return validationErrors;
                          }}
                        />
                        <Button
                          variant="light"
                          color="danger"
                          isIconOnly
                          onPress={() => {
                            if (formik.values.urls.length > 1) {
                              arrayHelpers.remove(index);
                            }
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="feather feather-x-circle w-4 h-4 text-red-500"
                          >
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                          </svg>
                        </Button>
                      </div>
                    );
                  })}

                  <div className="flex items-center gap-2">
                    <Button
                      color="primary"
                      variant="flat"
                      className="w-fit"
                      onPress={() => {
                        if (formik.values.urls.length >= maxLimit) {
                          addToast({
                            title: "Limit Reached",
                            description: `You can only add up to ${maxLimit} URLs.`,
                            color: "danger",
                          });
                          return;
                        }

                        arrayHelpers.push({
                          id: formik.values.urls.length + 1,
                          url: "",
                        });
                      }}
                    >
                      Add New URL
                    </Button>
                    <Button color="primary" variant="solid" type="submit">
                      Send Links
                    </Button>
                  </div>
                </div>
              )}
            />
          </Form>
        </FormikProvider>
      </div>
    </div>
  );
}
