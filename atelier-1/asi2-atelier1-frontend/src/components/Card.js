import React from 'react';
import { Card as SUICard, Image } from 'semantic-ui-react';

const Card = ({ image, title, description, extra }) => (
    <SUICard>
        {image && <Image src={image} wrapped ui={false} />}
        <SUICard.Content>
            <SUICard.Header>{title}</SUICard.Header>
            <SUICard.Description>{description}</SUICard.Description>
        </SUICard.Content>
        {extra && <SUICard.Content extra>{extra}</SUICard.Content>}
    </SUICard>
);

export default Card;