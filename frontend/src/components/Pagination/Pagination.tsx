type Props = {
    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;
};

export function Pagination({page, limit, total, onPageChange}: Props) {
    if (total <= limit) return null;

    return (
        <div onClick={() => onPageChange(page + 1)}>
            Load more 5 superheroes
        </div>
    );
}