module.exports = {
    categoryWithChildren: `
        WITH RECURSIVE subcategories (id) AS (
            SELECT id from categories where id = ?
            UNION ALL
            select c.id from subcategories, categories c
                where "parentId" = subcategories.id
        )
        SELECT id FROM subcategories
    `
}