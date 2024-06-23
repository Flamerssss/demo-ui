import React from 'react';
import { Tag } from 'antd';

const CustomTag = ({ property, propertiesObject }) => {
    const schema = property.schema[propertiesObject[property.title]];
    const colorName = schema?.color;
    const value = schema?.value;

    const tagColor = colorName || 'default';

    return (
        <Tag
            color={tagColor}
            style={{
                borderRadius: "16px",
                padding: "4px 12px",
                display: "inline-block",
                fontSize: "0.875rem",
                fontWeight: "500",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }}
        >
            {value}
        </Tag>
    );
};

export default CustomTag;
