// components/FamilyTree.js
import React from "react";
import "../styles/family-tree.css";

const FamilyTree = () => {
  const familyData = [
    {
      id: 1,
      name: "Grandfather 1",
      children: [
        {
          id: 2,
          name: "Father 1",
          children: [
            {
              id: 5,
              name: "Child 1",
            },
            {
              id: 6,
              name: "Child 2",
            },
          ],
        },
        {
          id: 3,
          name: "Aunt 1",
        },
        {
          id: 4,
          name: "Uncle 1",
        },
      ],
    },
    {
      id: 7,
      name: "Grandfather 2",
      children: [
        {
          id: 8,
          name: "Father 2",
          children: [
            {
              id: 9,
              name: "Child 3",
            },
            {
              id: 10,
              name: "Child 4",
            },
            {
              id: 11,
              name: "Child 5",
            },
          ],
        },
        {
          id: 12,
          name: "Aunt 2",
        },
      ],
    },
  ];

  const renderFamilyTree = (familyData, isChild = false) => {
    return (
      <ul
        className={`space-y-8 text-black items-center justify-center${
          isChild ? "ml-8" : "mr-2"
        }`}
      >
        {familyData.map((member) => (
          <li key={member.id} className="family-member">
            <div className="avatar">{member.name.charAt(0)}</div>
            <p>{member.name}</p>
            {member.children && (
              <>
                <div className="line-connector"></div>
                <div className="children mt-8">
                  <ul className="space-y-8">
                    {renderFamilyTree(member.children, true)}
                  </ul>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="family-tree-container">{renderFamilyTree(familyData)}</div>
  );
};

export default FamilyTree;
