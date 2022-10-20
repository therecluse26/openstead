const InputError = ({ messages = [], className = '' }) => (
    <>
        {messages.length > 0 && (
            <>
                {messages.map((message, index) => (
                    <div
                        className={`${className} text-sm text-red-600`}
                        key={index}>
                        {message}
                    </div>
                ))}
            </>
        )}
    </>
)

export default InputError
