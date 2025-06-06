import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import { useParams } from "react-router-dom";
import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { Navigate } from "react-router-dom";
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function MenuItemReviewEditPage({ storybook = false }) {
  let { id } = useParams();

  const {
    data: menuItemReview,
    _error,
    _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    [`/api/menuitemreviews?id=${id}`],
    {
      // Stryker disable next-line all : GET is the default, so mutating this to "" doesn't introduce a bug
      method: "GET",
      url: `/api/menuitemreviews`,
      params: {
        id,
      },
    },
  );

  const objectToAxiosPutParams = (menuItemReview) => ({
    url: "/api/menuitemreviews",
    method: "PUT",
    params: {
      id: menuItemReview.id,
    },
    data: {
      itemid: menuItemReview.itemid,
      comments: menuItemReview.comments,
      revieweremail: menuItemReview.revieweremail,
      stars: menuItemReview.stars,
      datereviewed: menuItemReview.datereviewed,
    },
  });

  const onSuccess = (menuItemReview) => {
    toast(
      `Menu Item Review Updated - id: ${menuItemReview.id} item id: ${menuItemReview.itemid} comments: ${menuItemReview.comments} reviewer email: ${menuItemReview.revieweremail} stars: ${menuItemReview.stars} date reviewed: ${menuItemReview.datereviewed}`,
    );
  };

  const mutation = useBackendMutation(
    objectToAxiosPutParams,
    { onSuccess },
    // Stryker disable next-line all : hard to set up test for caching
    [`/api/menuitemreviews?id=${id}`],
  );

  const { isSuccess } = mutation;

  const onSubmit = async (data) => {
    mutation.mutate(data);
  };

  if (isSuccess && !storybook) {
    return <Navigate to="/menuitemreview" />;
  }

  return (
    <BasicLayout>
      <div className="pt-2">
        <h1>Edit Menu Item Review</h1>
        {menuItemReview && (
          <MenuItemReviewForm
            submitAction={onSubmit}
            buttonLabel={"Update"}
            initialContents={menuItemReview}
          />
        )}
      </div>
    </BasicLayout>
  );
}
