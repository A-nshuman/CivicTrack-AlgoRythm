import React from 'react';
import { MapPin } from 'lucide-react';
import './TicketCard.scss'; // Import SCSS file

const TicketCard = ({ ticket, onClick }) => {
    // Helper to create a BEM-compatible class for status
    const statusClass = ticket.status.replace(' ', '-');

    const handleClick = () => {
        if (onClick) {
            onClick(ticket);
        }
    };

    return (
        <div className="ticket-card" onClick={handleClick}>
            <div className="ticket-card__image-wrapper">
                <img
                    className="ticket-card__image"
                    src={ticket.imageUrl}
                    alt={ticket.title}
                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/600x400/cccccc/ffffff?text=Image+Not+Found'; }}
                />
                <div className={`ticket-card__status ticket-card__status--${statusClass}`}>
                    {ticket.status}
                </div>
            </div>
            <div className="ticket-card__content">
                <div className="ticket-card__meta">
                    <span className="ticket-card__category">
                        {ticket.category}
                    </span>
                    <span className="ticket-card__distance">
                        <MapPin className="icon" />
                        {ticket.distance} km away
                    </span>
                </div>
                <h3 className="ticket-card__title">{ticket.title}</h3>
                <p className="ticket-card__description">{ticket.description}</p>
                <div className="ticket-card__footer">
                    Reported by {ticket.reporter} on {new Date(ticket.timestamp).toLocaleDateString()}
                </div>
            </div>
        </div>
    );
};

export default TicketCard;
