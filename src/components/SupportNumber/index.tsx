
const SupportNumber = ({ phoneNumber, children, phone }: any) => (
  <>
    {phone ? <a className="color-e4509d" href={`tel:${phoneNumber}`}>{children}</a>
      :
      <a className="color-e4509d" href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=Hi`} target="_blank">{children}</a>}
  </>
);

export default SupportNumber;