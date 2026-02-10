// ConflictModal.jsx
const ConflictModal = ({ message, onReload }) => (
    <div className="modal">
        <h3>Conflict detected </h3>
        <p>{message}</p>
        <button onClick={onReload}>Reload latest version</button>
    </div>
);

export default ConflictModal;